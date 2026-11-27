import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { useSimulatedFetch } from "../../loading";

// A pairing link of the real one's length, so the skeleton has the code's exact size.
const sampleLink = "https://ui.erbium.app/pair#token=00000000000000000000";

export const defaultProps = {} satisfies { latency?: number };

export default function QRCodeLoadingExample({ latency }: { latency?: number } = defaultProps) {
  const { data, loading } = useSimulatedFetch(
    "https://ui.erbium.app/pair#token=9f8a7b6c5d4e3f2a1b0c",
    { latency },
  );

  return (
    <Skeleton data={data} sample={sampleLink} loading={loading} label="Loading pairing code">
      {(link) => (
        <QRCode value={link}>
          <QRCodeImage aria-label="Scan to pair this device" />
        </QRCode>
      )}
    </Skeleton>
  );
}
