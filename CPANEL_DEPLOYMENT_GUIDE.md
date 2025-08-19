# 🚀 **cPanel Deployment Guide for Groq AI Chat**

## ✨ **What You're Getting:**

A **real AI-powered chat assistant** for your portfolio using Groq's Llama 4 Scout model, deployed on traditional cPanel hosting instead of serverless functions!

## 🔑 **Your Groq API Key:**

**⚠️ IMPORTANT: Keep this secure!**
- Set your key as a server Environment Variable named `GROQ_API_KEY` in cPanel
- Or provide it via a non-committed `config.php` file (outside `public_html`)
- **Model**: `meta-llama/llama-4-scout-17b-16e-instruct`
- **Provider**: Groq (faster than OpenAI, more cost-effective)

## 🌐 **cPanel Deployment Steps:**

### **Step 1: Prepare Your Files**

1. **Upload your portfolio files** to your cPanel hosting
2. **Ensure these files exist:**
   - `api/chat.php` ✅ (PHP backend)
   - `config.php` ✅ (API key configuration)
   - `main.js` ✅ (updated for PHP)
   - All HTML, CSS, and other files

### **Step 2: File Structure on cPanel**

```
public_html/
├── index.html
├── skills.html
├── projects.html
├── style.css
├── main.js
├── api/
│   └── chat.php
└── config.php (or outside public_html for security)
```

### **Step 3: Security Setup (Recommended)**

**Option A: Store config outside public_html (More Secure)**
1. **Upload `config.php`** to your home directory (outside public_html)
2. **Update `chat.php`** to use the secure path:
   ```php
   $config = include '../config.php';
   $GROQ_API_KEY = $config['groq_api_key'];
   ```

**Option B: Keep config in public_html (Less Secure)**
1. **Upload `config.php`** to your public_html directory
2. **Keep the current code** in `chat.php`

### **Step 4: Test Your Setup**

1. **Visit your live site**
2. **Click the AI chat button** 🤖
3. **Type a message** - Should get real AI responses!
4. **Check for errors** in browser console

## 🔧 **How It Works:**

### **cPanel Architecture:**
- **Frontend**: HTML/CSS/JavaScript (same as before)
- **Backend**: PHP script (`chat.php`) instead of serverless function
- **API**: Direct calls to Groq from your server
- **Security**: API key stored on server (more secure than client-side)

### **Request Flow:**
1. **User types message** → JavaScript sends POST to `chat.php`
2. **PHP processes request** → Calls Groq API with your key
3. **Groq responds** → PHP forwards response back to JavaScript
4. **User sees AI response** → Real Llama 4 Scout responses!

## 🧪 **Testing Your AI Chat:**

### **Before Upload:**
- Chat will show 404 errors (expected)
- No API endpoint exists locally

### **After cPanel Upload:**
- Chat will use real Groq API
- Intelligent, contextual responses
- Professional AI experience

## 💰 **Costs & Limits:**

### **Groq Pricing:**
- **Model**: `meta-llama/llama-4-scout-17b-16e-instruct`
- **Cost**: Very affordable (~$2-15/month)
- **Speed**: Faster than most AI providers
- **Tokens**: 1024 max per response

### **cPanel Hosting:**
- **Shared hosting**: $3-10/month
- **VPS hosting**: $10-30/month
- **Dedicated hosting**: $50+/month

## 🚨 **Troubleshooting:**

### **Common Issues:**

#### **1. "500 Internal Server Error"**
- **Solution**: Check PHP error logs in cPanel
- **Common cause**: PHP version too old (need PHP 7.4+)
- **Fix**: Update PHP version in cPanel

#### **2. "cURL not available"**
- **Solution**: Enable cURL in cPanel
- **Fix**: Contact hosting provider to enable cURL extension

#### **3. "API key not configured"**
- **Solution**: Check `config.php` path in `chat.php`
- **Fix**: Ensure config file is accessible

#### **4. "CORS errors"**
- **Solution**: Check CORS headers in `chat.php`
- **Fix**: Ensure headers are set correctly

### **Debug Steps:**
1. **Check cPanel error logs**
2. **Test PHP file directly** in browser
3. **Verify file permissions** (644 for files, 755 for directories)
4. **Check PHP version** (need 7.4+)

## 🎯 **Customization Options:**

### **Change AI Model:**
Edit `config.php`:
```php
'model' => 'llama3-8b-8192', // Faster, cheaper
'model' => 'mixtral-8x7b-32768', // More capable
'model' => 'meta-llama/llama-4-scout-17b-16e-instruct', // Current
```

### **Adjust AI Parameters:**
Edit `config.php`:
```php
'temperature' => 0.5, // Less creative (0.1 = focused, 1.0 = creative)
'max_tokens' => 2048, // Longer responses
'top_p' => 0.9, // Less diverse
```

## 🔒 **Security Best Practices:**

### **API Key Protection:**
- ✅ **Store outside public_html** (if possible)
- ✅ **Use .htaccess** to block direct access to config files
- ✅ **Set proper file permissions** (644 for files, 755 for directories)
- ✅ **Monitor usage** in Groq dashboard

### **Server Security:**
- **Enable HTTPS** (SSL certificate)
- **Set proper file permissions**
- **Keep PHP updated**
- **Monitor error logs**

## 🎉 **Ready to Deploy on cPanel!**

Your Groq AI chat is **fully configured** for cPanel hosting! Once uploaded, your portfolio will have:

- 🤖 **Real AI responses** from Groq
- 🚀 **Fast, intelligent conversations**
- 💰 **Cost-effective AI service**
- 🌐 **Traditional hosting compatibility**
- 📱 **Professional user experience**

**Next step**: Upload to cPanel and watch your portfolio come alive with real AI! 🚀✨

---

## 📞 **Need Help?**

If you encounter any issues:
1. **Check cPanel error logs**
2. **Verify PHP version** (7.4+ required)
3. **Test PHP file directly**
4. **Check file permissions**

The system is designed to work seamlessly with cPanel hosting! 🛡️
