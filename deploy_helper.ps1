# 部署辅助脚本

# 尝试查找 Git 路径
$gitPath = "git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        $gitPath = "C:\Program Files\Git\cmd\git.exe"
    } else {
        Write-Host "错误：未检测到 Git，且未在默认路径找到。请重启 VS Code 或终端后重试。" -ForegroundColor Red
        exit
    }
}

Write-Host "使用 Git 路径: $gitPath" -ForegroundColor Cyan

# 初始化仓库
if (-not (Test-Path ".git")) {
    Write-Host "正在初始化 Git 仓库..." -ForegroundColor Yellow
    & $gitPath init
}

# 添加文件
Write-Host "正在添加文件..." -ForegroundColor Yellow
& $gitPath add .

# 提交
Write-Host "正在提交代码..." -ForegroundColor Yellow
& $gitPath commit -m "Deploy: Ready for production"

# 推送提示
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "下一步：推送到 GitHub" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host "1. 请去 GitHub 创建一个新的空仓库 (Repository)"
Write-Host "2. 复制仓库地址 (例如 https://github.com/username/repo.git)"
Write-Host "3. 在下方粘贴地址并回车"

$repoUrl = Read-Host "GitHub 仓库地址"

if ($repoUrl) {
    & $gitPath remote remove origin 2>$null
    & $gitPath remote add origin $repoUrl
    & $gitPath branch -M main
    
    Write-Host "正在推送到 GitHub..." -ForegroundColor Yellow
    & $gitPath push -u origin main
    
    if ($?) {
        Write-Host "`n✅ 推送成功！" -ForegroundColor Green
        Write-Host "现在您可以去 Vercel 和 Render 导入这个仓库进行部署了。"
    } else {
        Write-Host "`n❌ 推送失败。请检查网络或账号权限。" -ForegroundColor Red
    }
} else {
    Write-Host "未输入地址，脚本结束。" -ForegroundColor Yellow
}
