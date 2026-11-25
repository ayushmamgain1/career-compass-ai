import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleAuthButton({ onCredential, onError, text = "continue_with", dividerLabel = "or use email" }) {
  const wrapperRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const measure = () => setWidth(Math.max(200, Math.min(400, Math.floor(el.getBoundingClientRect().width))));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // No client ID configured -> skip the Google option (and its divider) entirely
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <div ref={wrapperRef} className="flex justify-center min-h-11">
        {width > 0 && (
          <GoogleLogin
            onSuccess={(response) => onCredential(response.credential)}
            onError={onError}
            theme="filled_black"
            size="large"
            shape="rectangular"
            text={text}
            logo_alignment="left"
            width={String(width)}
          />
        )}
      </div>
      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-ink-line" />
        <span className="text-xs font-mono uppercase tracking-wider text-parchment-dim">{dividerLabel}</span>
        <div className="h-px flex-1 bg-ink-line" />
      </div>
    </div>
  );
}