// packages/security/url-validator.ts
import { URL } from "url";
import net from "net";
import dns from "dns";
import { ValidationError } from "./errors";
import { validateProviderHost } from "./providers";

// List of cloud metadata IP addresses
const CLOUD_METADATA_IPS = [
  "169.254.169.254", // AWS, OpenStack, GCP, etc.
  "168.63.129.16",   // Azure Metadata
  "100.100.100.200", // Alibaba Cloud
];

// Helper to check if an IP is private/loopback/metadata
export function isPrivateIp(ip: string): boolean {
  if (typeof window !== "undefined") return false;
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) return true;

    // Loopback: 127.0.0.0/8
    if (parts[0] === 127) return true;

    // Class A Private: 10.0.0.0/8
    if (parts[0] === 10) return true;

    // Class B Private: 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // Class C Private: 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;

    // Link-local: 169.254.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true;

    // Any / Broadcast / Test-net
    if (parts[0] === 0 || parts[0] === 255) return true;

    // Specific Metadata IPs
    if (CLOUD_METADATA_IPS.includes(ip)) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase().trim();
    
    // Loopback: ::1
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;

    // Unique Local Address: fc00::/7
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

    // Link-local: fe80::/10
    if (
      normalized.startsWith("fe80") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    ) {
      return true;
    }

    return false;
  }

  return false;
}

/**
 * Validates a URL structurally.
 * Throws a ValidationError if invalid.
 */
export function validateExternalUrl(urlStr: string, allowedProvider?: string): URL {
  if (!urlStr) {
    throw new ValidationError("Empty URL provided");
  }

  let url: URL;
  try {
    url = new URL(urlStr);
  } catch (err) {
    throw new ValidationError("Malformed URL structure");
  }

  // Reject URLs containing credentials
  if (url.username || url.password) {
    throw new ValidationError("URLs containing credentials are not allowed");
  }

  const hostname = url.hostname.toLowerCase();
  const protocol = url.protocol.toLowerCase();

  // Protocol validation
  const isLocalProvider =
    allowedProvider === "ollama" || allowedProvider === "lmstudio";

  if (isLocalProvider) {
    if (protocol !== "http:" && protocol !== "https:") {
      throw new ValidationError(`Invalid local provider protocol: ${protocol}`);
    }
  } else {
    if (protocol !== "https:") {
      throw new ValidationError(`Only HTTPS protocol is allowed. Got: ${protocol}`);
    }
  }

  // Check forbidden protocols explicitly
  const forbiddenProtocols = ["ftp:", "file:", "gopher:", "ws:", "wss:"];
  if (forbiddenProtocols.includes(protocol)) {
    throw new ValidationError(`Protocol ${protocol} is explicitly rejected`);
  }

  // Check metadata domains/hostnames
  if (hostname === "metadata.google.internal" || hostname.endsWith(".internal")) {
    throw new ValidationError("Internal metadata domains are rejected");
  }

  // Port checks
  if (url.port) {
    const portNum = parseInt(url.port, 10);
    if (isLocalProvider) {
      // Allow local development ports
      const allowedPorts = [1234, 11434, 12345];
      if (!allowedPorts.includes(portNum) && (portNum < 1024 || portNum > 65535)) {
        throw new ValidationError(`Unauthorized port for local provider: ${portNum}`);
      }
    } else {
      // Standard HTTPS port is 443. Reject any non-standard ports
      if (portNum !== 443) {
        throw new ValidationError(`Non-standard port rejected: ${portNum}`);
      }
    }
  }

  // If a provider constraint is specified, check against our allowlist
  if (allowedProvider) {
    const isValid = validateProviderHost(hostname, allowedProvider);
    if (!isValid) {
      throw new ValidationError(
        `Hostname '${hostname}' is not authorized for provider '${allowedProvider}'`
      );
    }
  } else {
    // If no provider context is supplied (general URL fetching, e.g. parse-file/url),
    // strictly reject loopback/private IPs from hostname directly
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      (typeof window === "undefined" && net.isIP(hostname) && isPrivateIp(hostname))
    ) {
      throw new ValidationError("Localhost and private IP hostnames are rejected");
    }
  }

  return url;
}

/**
 * Resolves a hostname via DNS and checks all returned IPs.
 * Throws a ValidationError if hostname resolves to private IP.
 */
export async function resolveAndValidateHost(
  hostname: string,
  isLocalProviderAllowed: boolean
): Promise<void> {
  if (typeof window !== "undefined") return;
  // If it's already an IP address, validate it directly
  if (net.isIP(hostname)) {
    const isPrivate = isPrivateIp(hostname);
    if (isPrivate && !isLocalProviderAllowed) {
      throw new ValidationError("Hostname resolved to a private IP address");
    }
    return;
  }

  try {
    const addresses = await dns.promises.lookup(hostname, { all: true });
    for (const addr of addresses) {
      const isPrivate = isPrivateIp(addr.address);
      if (isPrivate && !isLocalProviderAllowed) {
        throw new ValidationError(
          `DNS Rebinding Protection: Hostname '${hostname}' resolved to private IP: ${addr.address}`
        );
      }
    }
  } catch (err) {
    if (err instanceof ValidationError) throw err;
  }
}

export async function resolveAndGetSafeIp(
  hostname: string,
  isLocalProviderAllowed: boolean
): Promise<string> {
  if (typeof window !== "undefined") return hostname;
  if (net.isIP(hostname)) {
    const isPrivate = isPrivateIp(hostname);
    if (isPrivate && !isLocalProviderAllowed) {
      throw new ValidationError("Private IP addresses are not allowed");
    }
    return hostname;
  }
  const lookup = await dns.promises.lookup(hostname, { all: false });
  const ip = lookup.address;
  const isPrivate = isPrivateIp(ip);
  if (isPrivate && !isLocalProviderAllowed) {
    throw new ValidationError(`Hostname resolved to a private IP: ${ip}`);
  }
  return ip;
}
