window.addEventListener('DOMContentLoaded', function() {

//Slider

    let slideIndex = 1;
    const slides = document.querySelectorAll('.promo__slide'),
          prev = document.querySelector('.promo__slider-prev'),
          next = document.querySelector('.promo__slider-next'),
          titles = document.querySelectorAll('.promo__title'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current');

    showSlides(slideIndex);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        titles.forEach((item) => item.style.display = 'none');

        slides[slideIndex - 1].style.display = 'block'; 
        titles[slideIndex - 1].style.display = 'block'; 
        
        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
    }

    function plusSlides (n) {
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', function(){
        plusSlides(-1);
    });

    next.addEventListener('click', function(){
        plusSlides(1);
    });


    //Accordion

    const content = document.querySelectorAll('.services__info');
    const block = document.querySelector('.product__services');
    const buttons = document.querySelectorAll('.services__button');

    hideContent();

    function hideContent(i) {
        content.forEach(item => {
            item.classList.remove('active');
            item.style.maxHeight = null;
        });
    }

    function toggleContent(i) {
        if (content[i].style.maxHeight) {
            hideContent(i);
            buttons[i].classList.remove('services__button--minus');

        } else {
            content[i].style.maxHeight = content[i].scrollHeight + "px";
            content[i].classList.add('active');
            buttons[i].classList.add('services__button--minus');
        }
    }
    
    block.addEventListener('click', (e) => {
        const target = e.target;
        if (target) {
            buttons.forEach((item, i) => {
                if (target == item || target.parentNode == item) {
                    toggleContent(i);
                }
            });
        }
    });
});
