import { Config } from "@remotion/cli/config";

// Pre-installed Chrome headless shell (no download needed in this environment).
Config.setBrowserExecutable(
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
Config.setAudioCodec("aac");
Config.setOverwriteOutput(true);
