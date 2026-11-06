import { useCallback, useEffect, useRef, useState } from "react";

const MAX_SECONDS = 5 * 60; // auto-stop after 5 minutes

// Best format first. Chrome/Firefox/Edge record webm; Safari records mp4.
const PREFERRED_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

// Records a voice note with the browser's MediaRecorder.
//
//   const recorder = useVoiceRecorder();
//   const error = await recorder.start(({ blob, duration }) => { ... });
//   recorder.stop();    // finish -> calls the callback above
//   recorder.cancel();  // throw the recording away
//
// start() resolves to "" on success, or an error code:
// "unsupported" | "insecure" | "denied" | "failed".
// NOTE: browsers only allow the microphone on https:// or localhost.
export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);
  const cancelledRef = useRef(false);
  const onFinishRef = useRef(null);

  const supported =
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia);

  const release = useCallback(() => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setSeconds(0);
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    stop();
  }, [stop]);

  const start = useCallback(
    async (onFinish) => {
      if (!supported) return "unsupported";
      if (window.isSecureContext === false) return "insecure";

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = PREFERRED_TYPES.find((type) =>
          MediaRecorder.isTypeSupported?.(type)
        );
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

        chunksRef.current = [];
        cancelledRef.current = false;
        onFinishRef.current = onFinish;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          const duration = Math.max(
            1,
            Math.round((Date.now() - startedAtRef.current) / 1000)
          );
          const type = recorder.mimeType || mimeType || "audio/webm";
          const blob = new Blob(chunksRef.current, { type });
          const wasCancelled = cancelledRef.current;

          release();

          if (!wasCancelled && blob.size > 0) {
            onFinishRef.current?.({ blob, duration });
          }
        };

        recorder.start();
        recorderRef.current = recorder;
        streamRef.current = stream;
        startedAtRef.current = Date.now();
        setRecording(true);
        setSeconds(0);

        timerRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
          setSeconds(elapsed);
          if (elapsed >= MAX_SECONDS) stop();
        }, 250);

        return "";
      } catch (err) {
        return err?.name === "NotAllowedError" || err?.name === "SecurityError"
          ? "denied"
          : "failed";
      }
    },
    [supported, release, stop]
  );

  // If the user leaves the page mid-recording, discard it and free the mic
  useEffect(
    () => () => {
      cancelledRef.current = true;
      clearInterval(timerRef.current);
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  return { supported, recording, seconds, start, stop, cancel };
}
