import fs from "fs";
import path from "path";

export function generateIndexPHP(buildDir) {
  const htmlFile = path.join(buildDir, "index.html");
  const phpFile = path.join(buildDir, "index.php");

  try {
    // Read the generated index.html file
    const htmlContent = fs.readFileSync(htmlFile, "utf-8");

    // Remove the Jinja2 template script block (will be replaced with PHP version)
    const htmlWithoutJinja = htmlContent.replace(
      /<!-- Jinja2 embedded initial data[\s\S]*?<\/script>/,
      "<!-- PHP_INITIAL_DATA_PLACEHOLDER -->",
    );

    // PHP Template with embedded HTML content and server-side data fetching
    const phpTemplate = `<?php

    // Ensure the HTTP_USER_AGENT is set; if not, redirect to the home page
    if (empty($_SERVER['HTTP_USER_AGENT'])) {
        header('Location: /');
        exit();
    }
    
    // Check PHP version for str_contains function
    if (!function_exists('str_contains')) {
        die('Please upgrade your PHP version to 8.0 or above');
    }
    
    $isHtmlRequest = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'text/html');
    define('BASE_URL', 'https://yourdomain.com:443'); // Set the appropriate URL
    
    // Generate the full URL with the request URI
    $infoUrl = BASE_URL . ($_SERVER['REQUEST_URI'] ?? '') . '/info';
    $subUrl = BASE_URL . ($_SERVER['REQUEST_URI'] ?? '');
    
    // For HTML requests, fetch user data and embed it for instant loading
    if ($isHtmlRequest) {
        // Fetch user info
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $infoUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => $_SERVER['HTTP_USER_AGENT'],
            CURLOPT_CUSTOMREQUEST => 'GET',
        ]);
        
        $infoResponse = curl_exec($ch);
        $userData = null;
        
        if ($infoResponse !== false) {
            $userData = json_decode($infoResponse, true);
        }
        curl_close($ch);
        
        // Fetch subscription links
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $subUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'V2rayNG',
            CURLOPT_CUSTOMREQUEST => 'GET',
        ]);
        
        $linksResponse = curl_exec($ch);
        $links = [];
        
        if ($linksResponse !== false) {
            // Try to decode base64, otherwise split by newlines
            $decoded = @base64_decode($linksResponse, true);
            $linksText = ($decoded !== false && preg_match('/^(vmess|vless|trojan|ss):\\/\\//', $decoded)) 
                ? $decoded 
                : $linksResponse;
            $links = array_filter(explode("\\n", trim($linksText)), function($line) {
                return !empty($line) && $line !== 'False';
            });
        }
        curl_close($ch);
        
        // Build the initial data script
        $initialDataScript = '<script>
try {
    window.__INITIAL_DATA__ = {
        user: ' . ($userData ? json_encode($userData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : 'null') . ',
        links: ' . json_encode(array_values($links), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '
    };
} catch (e) {
    console.warn("Failed to parse initial data:", e);
    window.__INITIAL_DATA__ = null;
}
</script>';
        
        // Output HTML with embedded initial data
        $html = str_replace(
            '<!-- PHP_INITIAL_DATA_PLACEHOLDER -->',
            $initialDataScript,
            '${htmlWithoutJinja.replace(/'/g, "\\'")}'
        );
        echo $html;
        return;
    }
    
    // For non-HTML requests (subscription clients), proxy the request
    $requestUrl = $subUrl;
    
    // Initialize cURL session
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $requestUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_TIMEOUT => 17,
        CURLOPT_USERAGENT => $_SERVER['HTTP_USER_AGENT'],
        CURLOPT_CUSTOMREQUEST => 'GET',
    ]);
    
    $response = curl_exec($ch);
    
    // Handle cURL error
    if ($response === false) {
        die('cURL error: ' . curl_error($ch));
    }
    
    // Split the headers and body from the response
    $headerEndPos = strpos($response, "\\r\\n\\r\\n");
    if ($headerEndPos === false) {
        die('Invalid response format.');
    }
    
    $headerText = substr($response, 0, $headerEndPos);
    $responseBody = substr($response, $headerEndPos + 4);
    
    // Forward the necessary headers from the cURL response
    $isValidHeader = false;
    foreach (explode("\\r\\n", $headerText) as $i => $line) {
        if ($i === 0) continue;
        if (strpos($line, ": ") !== false) {
            list($key, $value) = explode(": ", $line, 2);
            if (in_array(strtolower($key), ['content-disposition', 'content-type', 'subscription-userinfo', 'profile-update-interval'])) {
                header("$key: $value");
                $isValidHeader = true;
            }
        }
    }
    
    if (!$isValidHeader && !$isHtmlRequest) {
        die("Error! No valid headers found.");
    }
    
    // Output the response body
    echo $responseBody;
    curl_close($ch);
    
    ?>
    `;

    // Write the index.php file
    fs.writeFileSync(phpFile, phpTemplate, "utf-8");
    console.log("Generated index.php successfully");
  } catch (error) {
    console.error("Error generating index.php:", error);
  }
}
