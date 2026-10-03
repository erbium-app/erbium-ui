import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import { Button } from "@erbium/ui/components/button";
import { StatefulIcon } from "@erbium/ui/components/stateful-icon";

interface CopyActionProps {
  target?: string;
  url?: string;
  text?: string;
  variant?: "ghost" | "outline";
  label?: string;
  iconOnly?: boolean;
}
export default function CopyAction({
  target,
  url,
  text = "Copy",
  variant = "ghost",
  label = "Copy code",
  iconOnly = false,
}: CopyActionProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    if (pending.current) return;
    pending.current = true;
    try {
      let content = target ? document.getElementById(target)?.textContent : undefined;
      if (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Markdown could not be loaded");
        content = await response.text();
      }
      if (content == null) throw new Error("Copy target could not be found");
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Unable to copy. Please try again.");
    } finally {
      pending.current = false;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setCopied(false);
        setStatus("");
      }, 2500);
    }
  };
  return (
    <>
      <Button
        variant={variant}
        size={iconOnly ? "icon-xs" : "xs"}
        aria-label={label}
        onClick={copy}
      >
        <StatefulIcon
          state={copied ? "copied" : "idle"}
          icons={{
            idle: <HugeiconsIcon icon={CopyIcon} size={14} />,
            copied: <HugeiconsIcon icon={CheckIcon} size={14} />,
          }}
        />
        {!iconOnly && <span data-copy-label>{copied ? "Copied" : text}</span>}
      </Button>
      <span className="sr-only" role="status">
        {status}
      </span>
    </>
  );
}
