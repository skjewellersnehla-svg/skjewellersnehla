echo "=============================="
echo "🛠️ STEP 1: Fixing App.tsx syntax..."
# यहाँ App.tsx के आखिरी हिस्से की टूटी हुई लाइन या फालतू प्लस को ठीक किया जा रहा है
node -e '
const fs = require("fs");
let code = fs.readFileSync("src/App.tsx", "utf8");
// अगर आखिरी में खुला हुआ ब्रैकेट या प्लस है तो उसे सही स्ट्रक्चर में बंद करें
if (code.includes("isAdmin &&") && code.includes("+")) {
  code = code.replace(/\+\s*<\/div>/g, "</div>");
  fs.writeFileSync("src/App.tsx", code, "utf8");
  console.log("✅ App.tsx syntax cleaned successfully!");
}
'

echo "=============================="
echo "📦 STEP 2: Running Build Check..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ BUILD PASSED!"
  echo "=============================="
  echo "🚀 STEP 3: Pushing to GitHub..."
  git add .
  git commit -m "Fix: Automated build and deployment fix by script"
  git push origin main
  echo "🎉 SUCCESS: Code pushed to GitHub! Vercel will now deploy automatically."
else
  echo "❌ BUILD FAILED! Please check the error above."
fi
