export type Locale = 'en' | 'vi';

export const translations = {
  en: {
    // Header
    headerTitle: 'AI Image Upscaler Pro',
    headerSubtitle: 'Transform your low-resolution images into high-quality masterpieces with a single click.',
    
    // Image Uploader
    uploaderPrompt: 'Click to upload or drag & drop images',
    uploaderFormats: 'PNG, JPG, or WEBP (Max 5MB per image)',

    // Control Panel
    upscaleEngine: 'Upscale Engine:',
    engineGenerative: 'Generative AI',
    engineGenerativeTooltip: 'Uses Gemini AI to creatively enhance and upscale the image. Best for artistic results and removing artifacts.',
    engineFidelity: 'Fidelity',
    engineFidelityTooltip: 'Uses a fast, in-browser algorithm for a technical upscale. Best for preserving original details and photorealism.',
    upscaleFactor: 'Upscale Factor:',
    clearQueue: 'Clear Queue',
    startBatch: 'Start Batch Processing',
    processing: 'Processing...',
    upscalingGoal: 'Upscaling Goal:',
    goalBalanced: 'Balanced',
    goalDetails: 'Details',
    goalSmoothness: 'Smoothness',
    preprocessing: 'Preprocessing:',
    noiseReduction: 'Noise Reduction',
    autoContrast: 'Auto Contrast',
    proMode: 'Pro Mode:',
    proModeTooltip: 'Uses advanced, multi-pass instructions for the AI to achieve superior detail and clarity. Recommended for best results.',
    colorEnhancement: 'Vibrance & Sharpen:',
    colorEnhancementTooltip: 'Applies post-processing filters to boost color vibrancy, contrast, and sharpness for an "8K Feel".',

    // Image Result Viewer & Job Card
    originalImageTitle: 'Original',
    upscaledImageTitle: 'Upscaled',
    downloadOptimizedJPG: 'Download JPG (Optimized)',
    downloadMaxQualityPNG: 'Download PNG (Max Quality)',
    compressing: 'Compressing...',
    preparing: 'Preparing...',
    batchQueueTitle: 'Processing Queue',
    jobStatusQueued: 'Queued',
    jobStatusProcessing: 'Processing...',
    jobStatusCompleted: 'Completed',
    jobStatusError: 'Error',
    upscaledPlaceholder: 'The upscaled image will appear here once processing is complete.',
    downloadButton: 'Download Upscaled Image',

    // Loading State
    loadingTitle: 'AI is enhancing your image...',
    loadingMessage1: 'Analyzing image pixels...',
    loadingMessage2: 'Applying deep learning models...',
    loadingMessage3: 'Enhancing fine details...',
    loadingMessage4: 'Reconstructing high-resolution version...',
    loadingMessage5: 'Almost there, finalizing the masterpiece...',

    // App/Error
    errorPrefix: 'Error: ',
    errorFileSize: (size: number) => `A file is too large. Please ensure all images are under ${size}MB.`,
    errorProcessImage: 'Could not process image. Please try another file.',
    errorReadFile: 'Failed to read the image file.',
    errorUnknown: 'An unknown error occurred during upscaling.',

    // Footer
    footerText: 'Powered by Google Gemini. Designed for high-quality image enhancement.',
  },
  vi: {
    // Header
    headerTitle: 'Nâng Cấp Ảnh AI Pro',
    headerSubtitle: 'Biến đổi hình ảnh độ phân giải thấp của bạn thành kiệt tác chất lượng cao chỉ với một cú nhấp chuột.',

    // Image Uploader
    uploaderPrompt: 'Nhấp để tải lên hoặc kéo và thả nhiều ảnh',
    uploaderFormats: 'PNG, JPG, hoặc WEBP (Tối đa 5MB mỗi ảnh)',

    // Control Panel
    upscaleEngine: 'Cơ Chế Nâng Cấp:',
    engineGenerative: 'AI Sáng Tạo',
    engineGenerativeTooltip: 'Sử dụng Gemini AI để nâng cấp và cải thiện ảnh một cách sáng tạo. Tốt nhất cho kết quả nghệ thuật và loại bỏ nhiễu.',
    engineFidelity: 'Độ Trung Thực',
    engineFidelityTooltip: 'Sử dụng thuật toán kỹ thuật, tốc độ cao ngay trên trình duyệt. Tốt nhất để bảo toàn chi tiết gốc và tính chân thực của ảnh.',
    upscaleFactor: 'Hệ Số Nâng Cấp:',
    clearQueue: 'Xóa Hàng Đợi',
    startBatch: 'Bắt Đầu Xử Lý Hàng Loạt',
    processing: 'Đang xử lý...',
    upscalingGoal: 'Mục Tiêu:',
    goalBalanced: 'Cân Bằng',
    goalDetails: 'Chi Tiết',
    goalSmoothness: 'Mịn Màng',
    preprocessing: 'Tiền Xử Lý:',
    noiseReduction: 'Khử Nhiễu',
    autoContrast: 'Tự Động Tương Phản',
    proMode: 'Chế Độ Pro:',
    proModeTooltip: 'Sử dụng các chỉ dẫn nâng cao, đa bước cho AI để đạt được độ chi tiết và rõ nét vượt trội. Khuyến nghị để có kết quả tốt nhất.',
    colorEnhancement: 'Độ Rực Rỡ & Sắc Nét:',
    colorEnhancementTooltip: 'Áp dụng các bộ lọc hậu kỳ để tăng cường độ rực rỡ, độ tương phản và độ sắc nét của màu sắc để tạo "Cảm giác 8K".',

    // Image Result Viewer & Job Card
    originalImageTitle: 'Ảnh Gốc',
    upscaledImageTitle: 'Đã Nâng Cấp',
    downloadOptimizedJPG: 'Tải JPG (Tối ưu)',
    downloadMaxQualityPNG: 'Tải PNG (Chất lượng tối đa)',
    compressing: 'Đang nén...',
    preparing: 'Đang chuẩn bị...',
    batchQueueTitle: 'Hàng Đợi Xử Lý',
    jobStatusQueued: 'Đang chờ',
    jobStatusProcessing: 'Đang xử lý...',
    jobStatusCompleted: 'Hoàn thành',
    jobStatusError: 'Lỗi',
    upscaledPlaceholder: 'Ảnh đã nâng cấp sẽ xuất hiện ở đây sau khi xử lý xong.',
    downloadButton: 'Tải Xuống Ảnh Đã Nâng Cấp',

    // Loading State
    loadingTitle: 'AI đang nâng cấp hình ảnh của bạn...',
    loadingMessage1: 'Đang phân tích các điểm ảnh...',
    loadingMessage2: 'Áp dụng các mô hình học sâu...',
    loadingMessage3: 'Nâng cao các chi tiết nhỏ...',
    loadingMessage4: 'Tái tạo phiên bản độ phân giải cao...',
    loadingMessage5: 'Sắp xong, đang hoàn thiện kiệt tác...',

    // App/Error
    errorPrefix: 'Lỗi: ',
    errorFileSize: (size: number) => `Có tệp quá lớn. Vui lòng đảm bảo tất cả ảnh đều dưới ${size}MB.`,
    errorProcessImage: 'Không thể xử lý hình ảnh. Vui lòng thử một tệp khác.',
    errorReadFile: 'Không thể đọc tệp hình ảnh.',
    errorUnknown: 'Đã xảy ra lỗi không xác định trong quá trình nâng cấp.',

    // Footer
    footerText: 'Phát triển bởi Google Gemini. Thiết kế để nâng cao chất lượng hình ảnh.',
  }
};