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
              ${getStarsHTML(reviewStar.value)}
           </div>
           <p>${commentText}</p>
        `;
 
        // 댓글 목록에 추가합니다.
        commentList.insertBefore(newComment, commentList.firstChild);
 
        // 댓글과 별점을 로컬 스토리지에 저장합니다.
        saveComment(commentText, reviewStar.value);
 
        // 폼을 초기화합니다.
        commentForm.reset();
 
    });
 
    function getStarsHTML(reviewStar) {
        // 폰트를 이용해 별을 표현합니다.
        const fullStar = '★';
        const halfStar = '☆';
 
        const stars = Array.from({ length: 5 }, (_, index) => index + 1 <= reviewStar);
        return stars.map((star, index) => `${star ? fullStar : halfStar}`).join('');
    }
 
    function saveComment(reviewContents, reviewStar) {
        // 저장된 댓글과 별점을 가져옵니다.
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
 
        // 새로운 댓글을 추가합니다.
        comments.push({ reviewContents, reviewStar });
 
        // 업데이트된 댓글 목록을 저장합니다.
        localStorage.setItem('comments', JSON.stringify(comments));
    }
 
    function loadComments() {
        // 저장된 댓글과 별점을 가져옵니다.
        const comments = JSON.parse(localStorage.getItem('comments')) || [];

        const reversedComments = comments.reverse();
        
        // 각 댓글을 화면에 표시합니다.
        comments.forEach(({ reviewContents, reviewStar }) => {
            const newComment = document.createElement('div');
            newComment.classList.add('comment-box');
            newComment.innerHTML = `
               <div class="reviewStar">
                  ${getStarsHTML(reviewStar)} <p>${reviewContents}</p>
               </div>
            `;
            commentList.insertBefore(newComment, commentList.firstChild);
        });
    }

    displayAverageRating();

   function displayAverageRating() {
       // 저장된 댓글과 별점을 가져옵니다.
       const comments = JSON.parse(localStorage.getItem('comments')) || [];

       // 별점 총합과 댓글 개수 초기화
       let totalRating = 0;
       let commentCount = 0;

       // 각 댓글의 별점을 총합에 더하고, 댓글 개수를 증가시킵니다.
       comments.forEach(({ reviewStar }) => {
           totalRating += parseInt(reviewStar);
           commentCount++;
       });

       // 별점 평균 계산
       const averageRating = commentCount > 0 ? totalRating / commentCount : 0;

       // 평균 별점을 표시하는 엘리먼트에 값을 설정합니다.
       const averageRatingElement = document.getElementById('average-rating');
       if (averageRatingElement) {
           averageRatingElement.textContent = `평균 별점: ${averageRating.toFixed(1)}점`;
       }
   }

   // 댓글 폼 이벤트 처리
   commentForm.addEventListener('submit', function (e) {
       e.preventDefault();

       // 댓글이 추가될 때마다 평균 별점을 다시 계산하여 표시합니다.
       displayAverageRating();
   });

 
    // localStorage.clear();  
 });
 
