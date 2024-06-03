(function(){
    const $slides = $('[data-slide]')
    const $slidesArray = $slides.toArray()
    const $slidesToggleUpButton = $('[data-slide-toggle="up"]')
    const $slidesToggleDownButton = $('[data-slide-toggle="down"]')

    function ifAllItemsTrue(arr) {
        return arr.every(element => element === true);
    }

    function slidePositionSet(){
        let $activeSlide = $('[data-slide].active').get(0)
        let $activeSlideIndex = $slidesArray.indexOf($activeSlide)

        let prevPosition
        let nextPosition

        if($activeSlideIndex == 0){
            // prevPosition = $slidesArray[$slidesArray.length - 1];
            prevPosition = $slidesArray[0];
        }else{
            prevPosition = $slidesArray[$activeSlideIndex - 1];
        }
    
        if($activeSlideIndex == $slidesArray.length - 1){
            // nextPosition = $slidesArray[0];
            nextPosition = $slidesArray[$slidesArray.length - 1];
        }else{
            nextPosition = $slidesArray[$activeSlideIndex + 1];
        }
    
        return[prevPosition, nextPosition];
    }

    function slidePositionUpdate(){
        let $activeSlide = $('[data-slide].active').get(0)
        let $activeSlideIndex = $slidesArray.indexOf($activeSlide)
        $slidesArray.map(function(eachItem, eachIndex){
            if(eachIndex === $activeSlideIndex){
                $(eachItem).addClass('active')
                $(eachItem).css('--slide-index', 0)
                $(eachItem).attr('tabindex', 0)
            }
            else if(eachIndex > $activeSlideIndex){
                $(eachItem).removeClass('active')
                // $(eachItem).css('--slide-index', eachIndex - $activeSlideIndex)
                // $(eachItem).attr('data-slide-index', eachIndex - $activeSlideIndex)
                $(eachItem).css('--slide-index', 1)
                $(eachItem).attr('tabindex', -1)
            }
            else{
                $(eachItem).removeClass('active')
                $(eachItem).css('--slide-index', -1)
                $(eachItem).attr('tabindex', -1)
            }
        })

        if($activeSlideIndex == 0){
            $slidesToggleUpButton.prop('disabled', true)
        }else{
            $slidesToggleUpButton.removeAttr('disabled')
        }

        checkCurrentFormFieldsValidOrNotOnInput()
        updateTextareaHeight()
    }

    function calculateVerticalHeight(){
        var vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', vh + 'px')
    }

    function checkCurrentFormFieldsValidOrNot(){
        let $currentSlidesInnerFields = $('[data-slide].active [data-form="inner"] [data-form-inner="input"]')
        let currentSlidesInnerFieldsArray = []
        let $currentSlidesInnerFieldsRequired = $('[data-slide].active [data-option-group]')
        $currentSlidesInnerFields.each(function(inputsIndex, inputsItem){
            if(inputsItem.type == 'checkbox'){
                if(typeof $currentSlidesInnerFieldsRequired.data('input-required') !== 'undefined'){
                    const currentTotalChecked = $('[data-slide].active [data-form="inner"] [data-form-inner="input"]:checked')
                    if(currentTotalChecked.length === 0) {
                        currentSlidesInnerFieldsArray.push(false)
                    }else{
                        currentSlidesInnerFieldsArray.push(true)
                    }
                }else{
                    currentSlidesInnerFieldsArray.push(true)
                }
            }else{
                currentSlidesInnerFieldsArray.push(inputsItem.checkValidity())
            }

        })

        if(ifAllItemsTrue(currentSlidesInnerFieldsArray)){
            $slidesToggleDownButton.removeAttr('disabled')
        }else{
            $slidesToggleDownButton.prop('disabled', true)
        }
    }

    function checkCurrentFormFieldsValidOrNotOnInput(){
        let $currentSlidesInnerFields = $('[data-slide].active [data-form="inner"] [data-form-inner="input"]')
        $currentSlidesInnerFields.on('input', function(){
            checkCurrentFormFieldsValidOrNot()
        })
    }

    function updateTextareaHeight(){
        $('[data-slide].active [data-form="inner"] textarea[data-form-inner="input"]').on('input', function(){
            $(this).css('height', 'auto')
            $(this).css('height', $(this).get(0).scrollHeight + 0.5 + 'px')
        })
    }

    $(window).on('resize', function(){
        calculateVerticalHeight();
    })

    $(document).ready(function () {
        calculateVerticalHeight()
        slidePositionUpdate()
        checkCurrentFormFieldsValidOrNot()

        $slidesToggleUpButton.on("click", function(){
            let $activeSlide = $('[data-slide].active')
            let [prevPosition, nextPosition] = slidePositionSet()
            $activeSlide.removeClass("active")
            $(prevPosition).addClass("active")
            slidePositionUpdate()
            checkCurrentFormFieldsValidOrNot()
        })

        $slidesToggleDownButton.on("click", function(){
            let $activeSlide = $('[data-slide].active')
            let [prevPosition, nextPosition] = slidePositionSet()
            $activeSlide.removeClass("active")
            $(nextPosition).addClass("active")
            slidePositionUpdate()
            checkCurrentFormFieldsValidOrNot()
        })

        $('[data-form-inner="input"]:not(textarea)').each(function(){
            $(this).on('keydown', function(event){
                if (event.key === 'Enter') {
                    return false
                }
            })
        })
    });
  
})()

/*
email validation:
    pattern="[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}"
checkbox required:
    data-option-group data-input-required
*/