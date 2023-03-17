
const svgIconLike = '<svg viewBox="-0.5 0.5 42 42" xmlns="http://www.w3.org/2000/svg" class="comment__icon"><path d="M20.938,10.725C14.51,0.796,1.5,6.205,1.5,17.021c0,8.122,17.836,20.827,19.438,22.479\n \tC22.551,37.848,39.5,25.143,39.5,17.021C39.5,6.287,27.378,0.796,20.938,10.725z" /></svg>';


document.addEventListener('DOMContentLoaded', function () {

    const commentsWrapper = document.querySelector('.comments__wrapper');

    const form = document.getElementById('form');
    const submitButton = form.querySelector('input[type="submit"]')

    form.name.addEventListener('input', function (event) {
        resetInputError(this);
    })

    form.text.addEventListener('input', function (event) {
        resetInputError(this);
    })

    form.addEventListener('submit', handlerSubmit);

    let commentsList = [
        {
            id: 'qrt4u8',
            user: 'User Name1',
            text:  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aliquid asperiores autem commodi culpa cum debitis dolore dolorum enim esse est ex expedita facilis fugit, hic id illo iusto laudantium minus molestiae nam natus nisi obcaecati officiis omnis optio praesentium quasi quis quos repellat repellendus similique sit sunt tempora tenetur ut voluptatum.',
            date: 1678183584000,
            isLiked: false
        },
        {
            id: 'rn5yu7',
            user: 'User Name2',
            text:  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aliquid asperiores autem commodi culpa cum debitis dolore dolorum enim esse est ex expedita facilis fugit, hic id illo iusto laudantium minus molestiae nam natus nisi obcaecati officiis omnis optio praesentium quasi quis quos repellat repellendus similique sit sunt tempora tenetur ut voluptatum.',
            date: 1678867584000,
            isLiked: true
        }
    ];

    createCommentsLine(commentsList)

    function createCommentsLine(arr) {
        commentsWrapper.innerHTML = '';

        arr.forEach( item => {
            const comment = createComment(item);
            commentsWrapper.append(comment)
        })

    }

    function createComment(data) {
        let { id, user, text, date, isLiked } = data;

        const wrapper = document.createElement('div');
        wrapper.className = 'card comment';
        wrapper.id = id;

        const head = document.createElement('div');
        head.className = 'comment__head';

        const name = document.createElement('h5');
        name.className = 'comment__name';
        name.innerHTML = user;
        head.append(name);

        const created = document.createElement('span');
        created.className = 'comment__date';
        created.innerHTML = convertDate(date);
        head.append(created);

        const body = document.createElement('div');
        body.className = 'comment__text';
        body.innerHTML = text;

        const footer = document.createElement('div');
        footer.className = 'comment__footer';

        const buttonDelete = document.createElement('button');
        buttonDelete.type = 'button';
        buttonDelete.className = 'comment__delete';
        buttonDelete.setAttribute('data-action', 'delete');
        buttonDelete.innerHTML = 'удалить';
        footer.append(buttonDelete);

        const buttonLike =  document.createElement('button');
        buttonLike.type = 'button';
        buttonLike.setAttribute('data-action', 'like')
        buttonLike.className = isLiked ? 'comment__like is-liked' :'comment__like';
        buttonLike.innerHTML = svgIconLike;
        footer.append(buttonLike);

        wrapper.addEventListener('click', handlerCardClick)

        wrapper.append(head);
        wrapper.append(body);
        wrapper.append(footer);

        return wrapper;
    }

    function handlerCardClick(event) {
        let button = event.target.closest('button');

        if(!button) return;

        let id = this.id;

        switch (button.dataset.action) {
            case 'delete':
                deleteComment(id)
                break;
            case 'like':
                likeComment(id);
                break;
        }

    }

    function handlerSubmit(event) {
        event.preventDefault();

        // console.log(this.date.value)

        if(!validateTextInput(this.name, 3, 60)) {
            showInputError(this.name, 'Пожалуйста, выберите корректное имя');
        }
        if(!validateTextInput(this.text, 3, 1500)) {
            showInputError(this.text, 'Пожалуйста, введите корректно текст');
        }

        if(
            validateTextInput(this.name, 3, 60) &&
            validateTextInput(this.text, 3, 1500)
        ) {
            let date = this.date.value.length > 0 ? new Date(this.date.value) : new Date()
            let id = generateId();

            commentsList.push(
                {
                    id: id,
                    user: this.name.value,
                    text: this.text.value,
                    date: date.getTime(),
                    isLiked: false
                }
            );

            createCommentsLine(commentsList);
            form.reset();
            showAlert();
        }

    }

    function deleteComment(id) {
        commentsList = commentsList.filter(elem => elem.id !== id);

        createCommentsLine(commentsList);

    }

    function likeComment(id) {
        commentsList = commentsList.map(item => {
            return item.id === id ? { ...item, isLiked: !item.isLiked} : item;
        });

        createCommentsLine(commentsList);
    }

    function generateId() {
        let simbols = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        let id = '';

        while (id.length < 6) {
            id += simbols[Math.floor(Math.random() * simbols.length)];
        }

        return id;

    }

    function validateTextInput(input, minlength = 3, maxlength) {
        if(input.value.length < minlength || input.value.length > maxlength) {
            return false;
        }

        return true;
    }


    function convertDate(value) {
        let date = new Date(value);
        let now = new Date();

        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());


        let period = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        let hours = addZero(date.getHours());
        let minutes = addZero(date.getMinutes());

        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)


        if( (date.getTime() - today.getTime()) / 3600000 >= 0) {
            return `сегодня, ${hours}:${minutes}`;
        } else if( (date.getTime() - yesterday.getTime()) / 3600000 >= 0){
            return `вчера, ${hours}:${minutes}`;
        } else {
            let year = date.getFullYear();
            let month = addZero( date.getMonth() + 1 );
            let day = addZero(date.getDate());

            return `${day}.${month}.${year} г.`
        }

    }

    function showInputError(elem, errorText = 'ошибка') {
        let alertWrapper = document.createElement('span');
        alertWrapper.className = 'form__error';
        alertWrapper.innerHTML = errorText;

        if(!elem.classList.contains('is-error')) elem.classList.add('is-error');

        submitButton.disabled = true;

        elem.after(alertWrapper);
    }

    function resetInputError(input) {
       input.classList.remove('is-error');

       let alert = input.parentElement.querySelector('.form__error');

       if(!alert) return;

       submitButton.disabled = false;

       alert.remove();
    }

    function addZero(str) {
        if(isFinite(str)) {
            return +str > 9 ? str : `0${str}`;
        }
        return false;
    }

    function showAlert() {
        const alert = document.getElementById('alert');

        alert.classList.remove('is-hidden');

        let timerId =  setTimeout(function (){
            alert.classList.add('is-hidden');
            clearTimeout(timerId);

        }, 3000);
    }

})