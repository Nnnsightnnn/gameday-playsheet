#!/bin/zsh
# Builds "Playsheet Chat.app" on the Desktop: a real app with its own icon that
# runs chat-start.sh in a Terminal window. Only needs re-running to change the icon.
set -e
HERE="${0:A:h}"
APP="$HOME/Desktop/Playsheet Chat.app"
WORK="$(mktemp -d)"

rm -rf "$APP"
osacompile -o "$APP" -e "do shell script \"open -a Terminal \" & quoted form of \"$HERE/chat-start.sh\""

# Clips the artwork to the macOS icon shape: an 824px body inside the 1024px grid.
swift - "$HERE/chat-icon.png" "$WORK/icon.png" <<'SWIFT'
import AppKit
let args = CommandLine.arguments
let image = NSImage(contentsOfFile: args[1])!
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1024, pixelsHigh: 1024, bitsPerSample: 8,
  samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
let body = NSRect(x: 100, y: 100, width: 824, height: 824)
NSBezierPath(roundedRect: body, xRadius: 185, yRadius: 185).addClip()
image.draw(in: body)
NSGraphicsContext.current?.flushGraphics()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
SWIFT

SET="$WORK/icon.iconset"
mkdir "$SET"
for s in 16 32 128 256 512; do
  sips -z $s $s "$WORK/icon.png" --out "$SET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s * 2)) $((s * 2)) "$WORK/icon.png" --out "$SET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$SET" -o "$APP/Contents/Resources/applet.icns"
cp "$WORK/icon.png" "${1:-/dev/null}"
touch "$APP"
rm -rf "$WORK"
echo "Built $APP"
