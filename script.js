// ==================== تهيئة الصفحة ====================
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initNavbar();
    initTheme();
    initCounters();
    initUploadSystem();
});

// ==================== شاشة التحميل ====================
function initPreloader() {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('fade-out');
        document.getElementById('mainWrapper').style.display = 'block';
    }, 2000);
}

// ==================== تأثير شريط التنقل ====================
function initNavbar() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==================== نظام الثيم ====================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    
    themeToggle.addEventListener('click', function() {
        if (root.style.getPropertyValue('--dark') === '#1a1a2e') {
            root.style.setProperty('--dark', '#f0f4f8');
            root.style.setProperty('--darker', '#e6e9f0');
            root.style.setProperty('--light', '#1a1a2e');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            root.style.setProperty('--dark', '#1a1a2e');
            root.style.setProperty('--darker', '#16213e');
            root.style.setProperty('--light', '#f7fafc');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// ==================== عدادات متحركة ====================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number-counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        
        const updateCounter = setInterval(() => {
            count += Math.ceil(target / 100);
            if (count > target) {
                count = target;
                clearInterval(updateCounter);
            }
            counter.textContent = count;
        }, 20);
    });
}

// ==================== نظام رفع الامتحانات ====================
function initUploadSystem() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('examFile');
    
    if (uploadArea) {
        // سحب وإفلات
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            uploadArea.classList.add('highlight');
        }

        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }

        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            handleFiles(files);
        }

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        function handleFiles(files) {
            const file = files[0];
            if (file && file.size <= 20 * 1024 * 1024) {
                const preview = document.getElementById('filePreview');
                document.querySelector('.file-name').textContent = file.name;
                document.querySelector('.file-size').textContent = 
                    (file.size / 1024 / 1024).toFixed(2) + ' ميجابايت';
                preview.style.display = 'flex';
                
                uploadToServer(file);
            } else {
                showNotification('الملف كبير جداً. الحد الأقصى ٢٠ ميجابايت', 'error');
            }
        }
    }
}

// ==================== رفع الملف إلى الخادم ====================
function uploadToServer(file) {
    showUploadProgress();
    
    // محاكاة رفع الملف
    setTimeout(() => {
        showNotification('تم رفع الامتحان بنجاح', 'success');
    }, 2000);
}

// ==================== شريط تقدم الرفع ====================
function showUploadProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'upload-progress';
    progressBar.innerHTML = `
        <div class="progress-container">
            <div class="progress-bar-upload"></div>
            <span class="progress-text">جاري الرفع... ٠٪</span>
        </div>
    `;
    document.body.appendChild(progressBar);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.querySelector('.progress-bar-upload').style.width = progress + '%';
        progressBar.querySelector('.progress-text').textContent = `جاري الرفع... ${progress}٪`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressBar.remove();
            }, 500);
        }
    }, 200);
}

// ==================== إشعارات ====================
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== طباعة الشهادة ====================
function printCertificate(studentName, examName, score, total) {
    const percentage = (score / total * 100).toFixed(2);
    let grade = '';
    
    if (percentage >= 90) grade = 'ممتاز';
    else if (percentage >= 80) grade = 'جيد جداً';
    else if (percentage >= 65) grade = 'جيد';
    else if (percentage >= 50) grade = 'مقبول';
    else grade = 'ضعيف';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>شهادة تقدير</title>
            <style>
                body { font-family: 'Cairo', sans-serif; background: #f0f4f8; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
                .certificate { max-width: 800px; background: white; padding: 50px; border: 20px solid gold; border-radius: 40px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
                .certificate h1 { font-size: 3em; color: navy; margin-bottom: 30px; }
                .student-name { font-size: 3.5em; color: gold; font-weight: 800; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
                .score { font-size: 5em; color: navy; font-weight: 800; }
                .grade { display: inline-block; background: gold; color: navy; padding: 10px 40px; border-radius: 50px; font-size: 2em; font-weight: 800; margin: 20px 0; }
                .date { color: gray; font-size: 1.2em; margin-top: 30px; }
                .seal { width: 120px; height: 120px; border-radius: 50%; background: gold; margin: 30px auto 0; display: flex; align-items: center; justify-content: center; font-size: 1.5em; color: navy; font-weight: 800; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1>🏆 شهادة تقدير 🏆</h1>
                <p>يشهد فريق منصة العباقرة بأن</p>
                <div class="student-name">${studentName}</div>
                <p>قد حصل على</p>
                <div class="score">${score}/${total}</div>
                <p>في امتحان: ${examName}</p>
                <div class="grade">${grade}</div>
                <p>بنسبة نجاح: ${percentage}٪</p>
                <div class="date">${new Date().toLocaleDateString('ar-EG')}</div>
                <div class="seal">معتمد</div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// ==================== تحميل الملفات ====================
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== إظهار/إخفاء الإجابة ====================
function toggleAnswer(button) {
    const answer = button.nextElementSibling;
    answer.classList.toggle('show');
    button.textContent = answer.classList.contains('show') ? 'إخفاء الحل' : 'عرض الحل';
}

// ==================== إظهار/إخفاء إجابات الامتحان ====================
function toggleExamAnswers(button) {
    const answers = button.nextElementSibling;
    answers.classList.toggle('show');
    button.textContent = answers.classList.contains('show') ? 'إخفاء الإجابات' : 'عرض نموذج الإجابة';
}