"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Zap, ArrowRight, Layers, Database, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AlgorithmVisualizer() {
  const [algorithm, setAlgorithm] = useState<"twoPointers" | "binarySearch" | "bubbleSort" | "stack" | "linkedList" | "kadane">("twoPointers");
  const [array, setArray] = useState<number[]>([2, 7, 11, 15]);
  const [stackItems, setStackItems] = useState<string[]>([]);
  const [target, setTarget] = useState(9);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [stepMsg, setStepMsg] = useState("Click Play to start algorithm animation step-by-step.");

  function resetVisualization() {
    setIsRunning(false);
    if (algorithm === "twoPointers") {
      setArray([2, 7, 11, 15]);
      setTarget(9);
      setLeftPointer(0);
      setRightPointer(3);
      setStepMsg("Two Pointers (Two Sum): Left = 0 (val: 2), Right = 3 (val: 15). Sum = 17 > 9. Move Right to 2.");
    } else if (algorithm === "binarySearch") {
      setArray([-1, 0, 3, 5, 9, 12]);
      setTarget(9);
      setLeftPointer(0);
      setRightPointer(5);
      setStepMsg("Binary Search: Low = 0 (-1), High = 5 (12). Mid = 2 (val: 3 < target 9). Move Low to Mid + 1.");
    } else if (algorithm === "stack") {
      setStackItems(["("]);
      setStepMsg("Stack (Valid Parentheses): Push '(' onto Stack. Stack size: 1.");
    } else if (algorithm === "linkedList") {
      setArray([1, 2, 3, 4, 5]);
      setLeftPointer(0);
      setRightPointer(1);
      setStepMsg("Reverse Linked List: Reverse pointer between Node(1) and Node(2).");
    } else if (algorithm === "kadane") {
      setArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      setLeftPointer(3);
      setRightPointer(6);
      setStepMsg("Kadane's Algorithm (DP): Max Subarray [4, -1, 2, 1] with Max Sum = 6.");
    } else {
      setArray([5, 1, 4, 2, 8]);
      setLeftPointer(0);
      setRightPointer(1);
      setStepMsg("Sorting Animation: Comparing elements 5 and 1. Swap required.");
    }
  }

  useEffect(() => {
    resetVisualization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        if (algorithm === "twoPointers") {
          const sum = array[leftPointer] + array[rightPointer];
          if (sum === target) {
            setStepMsg(`🎉 Solution Found! indices [${leftPointer}, ${rightPointer}] sum up to target ${target}.`);
            setIsRunning(false);
          } else if (sum > target) {
            if (rightPointer > leftPointer + 1) {
              setRightPointer(r => r - 1);
              setStepMsg(`Sum ${sum} > target ${target}. Decremented right pointer to index ${rightPointer - 1}.`);
            } else {
              setIsRunning(false);
            }
          }
        } else if (algorithm === "binarySearch") {
          setLeftPointer(4);
          setRightPointer(4);
          setStepMsg(`🎉 Target 9 found at index 4 (Mid = 4)!`);
          setIsRunning(false);
        } else if (algorithm === "stack") {
          setStackItems(["(", "{", "}"]);
          setStepMsg("Popped '}' matching '{'. Stack balance verified.");
          setIsRunning(false);
        } else {
          setIsRunning(false);
        }
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isRunning, leftPointer, rightPointer, array, target, algorithm]);

  return (
    <div className="p-5 bg-card border border-border/60 rounded-2xl space-y-5 font-mono text-xs shadow-lg">
      <div className="flex flex-wrap items-center justify-between border-b border-border/30 pb-3 gap-2">
        <span className="font-bold text-foreground flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-amber-400" />
          Interactive Algorithm Visualizer Engine
        </span>
        <select
          value={algorithm}
          onChange={(e: any) => setAlgorithm(e.target.value)}
          className="bg-secondary/60 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground font-semibold focus:outline-none"
        >
          <option value="twoPointers">Two Pointers (Two Sum)</option>
          <option value="binarySearch">Binary Search (O(log n))</option>
          <option value="bubbleSort">Sorting (Bubble Sort)</option>
          <option value="stack">Stack (Valid Parentheses)</option>
          <option value="linkedList">Linked List Reversal</option>
          <option value="kadane">Dynamic Programming (Kadane)</option>
        </select>
      </div>

      {/* Visual Array / Data Structure Representation */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-8 bg-[#0d1117] rounded-xl border border-border/40 min-h-[140px]">
        {algorithm === "stack" ? (
          <div className="flex flex-col-reverse gap-2 items-center">
            {stackItems.map((st, i) => (
              <div key={i} className="w-20 h-10 bg-indigo-500/20 border border-indigo-400 rounded-lg flex items-center justify-center font-bold text-indigo-300 text-sm">
                {st}
              </div>
            ))}
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Stack Bottom</span>
          </div>
        ) : (
          array.map((val, idx) => {
            const isLeft = idx === leftPointer;
            const isRight = idx === rightPointer;

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-14 rounded-xl border flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    isLeft && isRight
                      ? "bg-emerald-500/30 border-emerald-400 text-emerald-300 scale-110 shadow-glow-emerald"
                      : isLeft
                      ? "bg-sky-500/20 border-sky-400 text-sky-300 scale-105"
                      : isRight
                      ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 scale-105"
                      : "bg-secondary/30 border-border/40 text-slate-300"
                  }`}
                >
                  {val}
                </div>
                <span className="text-[9px] text-muted-foreground">idx: {idx}</span>
                {isLeft && <Badge className="bg-sky-500/20 text-sky-400 text-[8px] py-0">L</Badge>}
                {isRight && <Badge className="bg-indigo-500/20 text-indigo-400 text-[8px] py-0">R</Badge>}
              </div>
            );
          })
        )}
      </div>

      {/* Step Status Message */}
      <div className="p-3.5 bg-secondary/20 rounded-xl border border-border/30 text-slate-300 text-center leading-relaxed">
        {stepMsg}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <Button size="sm" variant="outline" onClick={resetVisualization} className="h-8 text-xs gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Animation
        </Button>
        <Button
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          className="h-8 text-xs gap-1.5 bg-emerald-500 text-black font-bold hover:bg-emerald-400"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isRunning ? "Pause" : "Play Step-by-Step"}
        </Button>
      </div>
    </div>
  );
}
