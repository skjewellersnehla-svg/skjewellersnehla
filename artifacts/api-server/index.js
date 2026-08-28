cd ~/workspace && \
cat << 'EOF' > artifacts/web-app/index.html
<!DOCTYPE html>
<html lang="hi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S.K. Jewellers (नेहला) - Admin & Catalog</title>
  </head>
  <body class="bg-amber-50">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
git add . && git commit -m "fix: update web-app index.html with proper title and root" && git push origin main
