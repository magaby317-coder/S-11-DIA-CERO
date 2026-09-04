$port = 8085
$prefix = "http://localhost:$port/"
$baseDir = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    $listener.Start()
    Write-Host "Servidor DÍA CERO escuchando en $prefix"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        try {
            $rawUrl = $req.RawUrl
            if ($rawUrl -eq "/" -or [string]::IsNullOrWhiteSpace($rawUrl)) {
                $rawUrl = "/index.html"
            }

            $cleanPath = $rawUrl.Split('?')[0].Split('#')[0]
            $localPath = [System.IO.Path]::Combine($baseDir, $cleanPath.TrimStart('/').Replace('/', '\'))

            if ([System.IO.File]::Exists($localPath)) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $res.ContentType = $contentType
                $res.StatusCode = 200
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawUrl")
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        } catch {
            Write-Host "Error en petición: $($_.Exception.Message)"
        } finally {
            try { $res.OutputStream.Close() } catch {}
        }
    }
} catch {
    Write-Host "Servidor detenido: $($_.Exception.Message)"
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
