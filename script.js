document.addEventListener('DOMContentLoaded', () => {
    // 1. รับองค์ประกอบ HTML ที่สำคัญ
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const uploadedImage = document.getElementById('uploadedImage');
    const loadingText = document.getElementById('loadingText');
    const startButton = document.querySelector('.start-button');
    const downloadLink = document.getElementById('downloadLink'); // องค์ประกอบสำหรับปุ่มดาวน์โหลด
    
    // API Key (แทนที่ด้วย API Key จริงของคุณ)
    const apiKey = 'UDRWuTSDoXJFWvgV3UApzFJc'; // <--- *เปลี่ยนตรงนี้*

    // 2. ผูกปุ่มเริ่มต้นเข้ากับ Input File ที่ซ่อนไว้
    startButton.addEventListener('click', () => {
        imageInput.click();
    });

    // 3. เมื่อมีการเลือกไฟล์ (ไฟล์มีการเปลี่ยนแปลง)
    imageInput.addEventListener('change', function(event) {
        if (event.target.files.length === 0) return;

        const file = event.target.files[0];
        
        // 3.1 สร้าง FormData สำหรับส่งข้อมูลไปยัง API
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto'); // กำหนดขนาดผลลัพธ์

        // 3.2 แสดงสถานะ Loading และซ่อนพรีวิว/ปุ่มดาวน์โหลดเดิม
        loadingText.style.display = 'block';
        previewContainer.style.display = 'none';
        downloadLink.style.display = 'none'; // ซ่อนปุ่มดาวน์โหลดไว้ก่อน
        loadingText.textContent = 'กำลังดำเนินการ...';
        loadingText.style.color = '#00c6ff'; // คืนค่าสีเดิม

        // 3.3 เรียกใช้ API สำหรับลบพื้นหลัง
        fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey,
            },
            body: formData,
        })
        .then(response => {
            // ตรวจสอบสถานะการตอบกลับ
            if (!response.ok) {
                // หากมีข้อผิดพลาด (เช่น API Key ผิด, โควต้าหมด)
                return response.json().then(err => {
                    throw new Error(err.errors ? err.errors[0].title : 'Error removing background');
                });
            }
            // แปลงการตอบกลับเป็น Blob (ไบนารีข้อมูลรูปภาพ)
            return response.blob();
        })
        .then(blob => {
            // 3.4 สร้าง URL ชั่วคราวจาก Blob
            const imageUrl = URL.createObjectURL(blob);
            
            // 3.5 แสดงภาพผลลัพธ์
            uploadedImage.src = imageUrl;
            uploadedImage.style.display = 'block'; // ให้แน่ใจว่ารูปภาพแสดง
            previewContainer.style.display = 'block'; // แสดงกล่องพรีวิว
            loadingText.style.display = 'none'; // ซ่อนสถานะ Loading

            // 3.6 ผูก URL ของภาพผลลัพธ์เข้ากับปุ่มดาวน์โหลด
            downloadLink.href = imageUrl;
            downloadLink.style.display = 'block'; // แสดงปุ่มดาวน์โหลด
            
        })
        .catch(error => {
            // 3.7 จัดการข้อผิดพลาด
            console.error('Error:', error);
            loadingText.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
            loadingText.style.color = 'red';
            
            // แสดงข้อผิดพลาด 5 วินาที ก่อนซ่อน
            setTimeout(() => {
                 loadingText.style.display = 'none';
            }, 5000); 
        });
    });
});
