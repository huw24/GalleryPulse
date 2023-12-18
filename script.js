document.addEventListener('DOMContentLoaded', function () {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');

    // 저장된 댓글과 별점을 로드합니다.
    loadComments();

    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 댓글과 별점을 가져옵니다.
        const commentText = document.getElementById('reviewContents').value;
        const reviewStar = document.querySelector('input[name="reviewStar"]:checked');

        if (!reviewStar) {
            alert('별점을 선택해주세요.');
            return;
        }

        // 새로운 댓글을 생성합니다.
        const newComment = document.createElement('div');
        newComment.classList.add('comment-box');
        newComment.innerHTML = `
            <div class="reviewStar">
                ${getStarsHTML(reviewStar.value)} <p>${commentText}</p>
            </div>
        `;

        // 댓글 목록의 가장 위에 추가합니다.
        commentList.insertBefore(newComment, commentList.firstChild);

        // 댓글과 별점을 로컬 스토리지에 저장합니다.
        saveComment(commentText, reviewStar.value);

        // 폼을 초기화합니다.
        commentForm.reset();

        // 댓글이 추가될 때마다 평균 별점을 다시 계산하여 표시합니다.
        displayAverageRating();
    });

    function getStarsHTML(reviewStar) {
        const fullStar = '★';
        const halfStar = '☆';

        const stars = Array.from({ length: 5 }, (_, index) => index + 1 <= reviewStar);
        return stars.map((star, index) => `${star ? fullStar : halfStar}`).join('');
    }

    function saveComment(reviewContents, reviewStar) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ reviewContents, reviewStar });
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];

        // 각 댓글을 화면에 표시합니다.
        comments.forEach(({ reviewContents, reviewStar }) => {
            const newComment = document.createElement('div');
            newComment.classList.add('comment-box');
            newComment.innerHTML = `
                <div class="reviewStar">
                    ${getStarsHTML(reviewStar)} <p>${reviewContents}</p>
                </div>
            `;
            // 댓글 목록의 가장 위에 추가합니다.
            commentList.insertBefore(newComment, commentList.firstChild);
        });

        // 댓글이 로드될 때마다 평균 별점을 표시합니다.
        displayAverageRating();
    }

    function displayAverageRating() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        let totalRating = 0;
        let commentCount = 0;

        comments.forEach(({ reviewStar }) => {
            totalRating += parseInt(reviewStar);
            commentCount++;
        });

        const averageRating = commentCount > 0 ? totalRating / commentCount : 0;

        const averageRatingElement = document.getElementById('average-rating');
        if (averageRatingElement) {
            averageRatingElement.textContent = `평균 별점: ${averageRating.toFixed(1)}점`;
        }
    }
});
