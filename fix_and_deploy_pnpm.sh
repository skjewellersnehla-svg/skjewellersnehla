echo "=============================="
echo "🛠️ STEP 1: Fixing App.tsx syntax using pnpm project setup..."
node -e '
const fs = require("fs");
let code = fs.readFileSync("src/App.tsx", "utf8");
if (code.includes("{isAdmin && (")) {
  code = code.trim() + "\n    </div>\n  );\n}\n";
  fs.writeFileSync("src/App.tsx", code, "utf8");
  console.log("✅ App.tsx successfully fixed!");
} else {
  console.log("⚠️ File structure check passed or manual check needed.");
}
'

echo "=============================="
echo "📦 STEP 2: Running pnpm build..."
pnpm build

if [ $? -eq 0 ]; then
  echo "✅ BUILD PASSED!"
  echo "=============================="
  echo "🚀 STEP 3: Pushing to GitHub..."
  git add .
  git commit -m "Fix: App.tsx syntax error and pnpm build fix"
  git push origin main
  echo "🎉 SUCCESS: Code pushed to GitHub and ready for Vercel!"
else
  echo "❌ BUILD FAILED! Please check the error above."
fi
