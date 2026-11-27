import { Button } from "@erbium/ui/components/button";
import {
  QRCode,
  QRCodeCaption,
  QRCodeFrame,
  QRCodeImage,
  QRCodeOverlay,
} from "@erbium/ui/components/qr-code";
import { useEffect, useState } from "react";

// Seconds. Short, so the example expires while you watch.
const lifetime = 15;

export default function QRCodeExpiringExample() {
  // In an app the server issues each link and refuses an expired one.
  const [issue, setIssue] = useState(1);
  const [remaining, setRemaining] = useState(lifetime);
  const expired = remaining === 0;

  useEffect(() => {
    // At zero this sets the same value, so the countdown stops there.
    const timer = setTimeout(() => {
      setRemaining(Math.max(0, remaining - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [remaining]);

  return (
    <QRCode value={`https://ui.erbium.app/pair#token=demo-${issue}`}>
      <QRCodeFrame>
        <QRCodeImage aria-label={expired ? "Expired pairing code" : "Scan to pair this device"} />
        {expired ? (
          <QRCodeOverlay>
            <span>Code expired</span>
            <Button
              size="sm"
              onClick={() => {
                setIssue((current) => current + 1);
                setRemaining(lifetime);
              }}
            >
              New code
            </Button>
          </QRCodeOverlay>
        ) : null}
      </QRCodeFrame>
      <QRCodeCaption className="tabular-nums">
        {expired ? "Get a new code to pair." : `Expires in ${remaining} seconds.`}
      </QRCodeCaption>
    </QRCode>
  );
}
