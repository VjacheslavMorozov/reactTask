
/**
 * Список доступных утилит для использования
 * Все входные данные необходимые для методов читать
 * конкретно для каждого
 * -
 * @delegate делегирование события на динамических элементах
 * =
 * @offsetTop Положение объекта на странице относительно
 * верха страницы
 * -
 * @offsetLeft Положение объекта на странице относительно
 * лева страницы
 * -
 * @remove Удалить элемент из DOM дерева
 * @replaceWith заменить один элемент на другой
 * @trim функция для обрезки строки по краям
 * -
 * @isFunction проверка объекта является ли он функцией
 * @isArray проверка объекта является ли он массивом
 * @isObject проверка объекта является ли он объектом
 * @isString проверка объекта является ли он строкой
 * -
 * @sendGet отправка GET запроса
 * @sendPost отправка POST запроса
 * @sendForm отправка сериализированной формы
 */

/**
 * Проверка является ли передаваемый элемент функцией
 * @param element
 * @return bool
 */


export const isFunction = element =>
    Object.prototype.toString.call(element) === "[object Function]";
/**
 * Проверка является ли передаваемый элемент строкой
 * @param element
 * @return bool
 */

export const isString = element =>
    Object.prototype.toString.call(element) === "[object String]";

/**
 * Проверка является ли передаваемый элемент массивом
 * @param element
 * @return bool
 */

export const isNumber = element =>
    Object.prototype.toString.call(element) === "[object Number]" && !isNaN(element);

/**
 * Проверка является ли передаваемый элемент массивом
 * @param element
 * @return bool
 */

export const isArray = element =>
    Object.prototype.toString.call(element) === "[object Array]";

/**
 * Проверка является ли передаваемый элемент объектом
 * @param element
 * @return bool
 */

export const isObject = element =>
    Object.prototype.toString.call(element) === "[object Object]";

/**
 * Функцмя делегирования событий относительно родительского объекта
 * @param parentDelegate
 * @param event
 * @param elementCssClass
 * @param callback
 */

export const delegate = (parentDelegate, event, elementCssClass, callback) => {
    parentDelegate.addEventListener(event, (eventElement) => {
        const element = eventElement.target.closest(elementCssClass);

        return element
            ? callback(eventElement, element)
            : "";
    }, false);
};

/**
 * Функция триггера события на елементе
 * @param element DOM element
 * @param eventName string
 * @param typeEvent string "UIEvents", "MouseEvents", "MutationEvents", "HTMLEvents"
 * @param bubbles bool
 * @param cancelable bool
 */

export const triggerEvent = (element, eventName, typeEvent = "HTMLEvents", bubbles = true, cancelable = false) => {
    if(!eventName) {
        console.error('Dont added eventName in method triggerEvent => utility/library.js')
    }

    const event = document.createEvent(typeEvent);
    event.initEvent(eventName,bubbles,cancelable);
    element.dispatchEvent(event);
};

const returnCorrectPositionElement = (windowOffset, elementClient) =>
    windowOffset - elementClient;

/**
 * возвращает координаты относительно начала страницы
 * @param DOMObject
 * @return number
 */

export const offsetTop = DOMObject =>
    DOMObject.getBoundingClientRect().top + returnCorrectPositionElement(
    window.pageYOffset,
    DOMObject.clientTop,
    ) || 0;

/** возвращает координаты относительно левого края начала страницы
 * @param DOMObject
 * @return number
 */

export const offsetLeft = DOMObject =>
    DOMObject.getBoundingClientRect().left + returnCorrectPositionElement(
    window.pageXOffset,
    (DOMObject.clientLeft || 0),
    );

/**
 * Удаление из DOM дерева
 * @param DOMObject
 */
export const remove = DOMObject =>
    DOMObject.parentNode.removeChild(DOMObject);

/**
 * замена одного элемента другим, предварительно
 * переда DOM JS Object
 * @param beforeDOMObject DOMObject объект который нужно заменить
 * @param afterDOMObject DOMObject объект на который нужно
 * произвести замену
 */

export const replaceWith = (beforeDOMObject, afterDOMObject) => {
    beforeDOMObject
        .parentNode
        .replaceChild(afterDOMObject, beforeDOMObject);

    return afterDOMObject;
};

/**
 * Функция Trim для обрезки пробелов, до и после строки
 * @param string
 * @return string
 */
export const trim = string => string != null && string.replace(/^\s+|\s+$/g, "") || "";

/**
 * Преобразование html в JS DOM Object для последующего добавления в DOM
 * @param html
 * @return {DocumentFragment}
 */

const htmlToObjectJS = (html) => {
    const fragmentDocument = document.createDocumentFragment();
    const hiddenHTMLBlock = document.createElement("div");
    hiddenHTMLBlock.innerHTML = html;

    [...hiddenHTMLBlock.childNodes].forEach((oneObject) => {
        fragmentDocument.appendChild(oneObject);
        return oneObject;
    });

    return fragmentDocument;
};

/**
 * безопасный парсинг в JSON
 * @param data string
 * @return Object
 */

const safelyJSONParse = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

/**
 * Возврашение результата запроса,
 * в случае передачи dataType: "json", преобразовать в JSON
 * @param returnedDataType
 * @param responseData
 */

const returnTypeResponse = (returnedDataType, responseData) => {
    if (returnedDataType && returnedDataType.toLowerCase() === "json") {
        return safelyJSONParse(responseData);
    }

    return responseData;
};

/**
 * Статусы сервера необходимые для запросов
 * @type {{success: number, notFound: number, forbidden: number}}
 */
const serverStatuses = {
    success: 200, // Успешно
    notFound: 404, // не найдено
    forbidden: 403, // запрещено
};

/**
 * URLSearchParams check params
 * преобразование объекта в string для тела запроса
 * @param objectRequest object
 * @returns {string}
 */

export const encodeToStringUrl = (objectRequest) => {
    const resultQueryArray = [];

    const addToResultQueryArray = (key, value) => {
        resultQueryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === null || undefined ? "" : value)}`);
    };

    const buildParams = (prefix, obj) => {
        if (prefix) {
            if (isArray(obj)) {
                obj.map((value, i) =>
                    /\[\]$/.test(prefix)
                        ? addToResultQueryArray(prefix, obj[i])
                        : buildParams(`${prefix}[${typeof value === "object" ? i : ""}]`, value),
                );
            } else if (obj && isObject(obj)) {
                Object.keys(obj).map(
                    key => buildParams(`${prefix}[${key}]`, obj[key]),
                );
            } else {
                addToResultQueryArray(prefix, obj);
            }
        } else if (isArray(obj)) {
            obj.map(value => addToResultQueryArray(obj[value].name, obj[value].value));
        } else {
            Object.keys(obj).map(key => buildParams(key, obj[key]));
        }

        return resultQueryArray;
    };

    return buildParams("", objectRequest)
        .join("&")
        .replace(/%20|\s/g, "+");
};

/**
 * выпосление callback функций после запроса
 * @param xhr
 * @param params
 */
const requestCallBack = (xhr, params) => {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status !== serverStatuses.success) {
            isFunction(params.error) && params.error();
        } else {
            isFunction(params.success) && params.success(
                returnTypeResponse(params.dataType, xhr.responseText),
            );
        }
    }

    return xhr;
};

/**
 * @param params
 * @param.url param.url url запроса
 * @param.body param.body тело запроса string
 * @param.dataType param.dataType тип возвращаемых данный
 * (при неоходимости JSON передать значение "json")
 * @param.success param.success callback функция в случае удачного запроса
 * @param.error param.error callback функция в случае ошибки запроса
 */

export const sendGet = (params) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${params.url}?${params.body ? encodeToStringUrl(params.body) : ""}`, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(null);
    xhr.onreadystatechange = () => requestCallBack(xhr, params);
};

/**
 * @param params
 * @param.url param.url url запроса
 * @param.body param.body тело запроса string
 * @param.dataType param.dataType тип возвращаемых данный
 * (при неоходимости JSON передать значение "json")
 * @param.success param.success callback функция в случае удачного запроса
 * @param.error param.error callback функция в случае ошибки запроса
 */

export const sendPost = (params) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", params.url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params.body ? encodeToStringUrl(params.body) : "");

    const requestParams = Object.assign({}, params);
    requestParams.dataType = params.dataType || "";

    xhr.onreadystatechange = () => requestCallBack(xhr, requestParams);
};

/**
 * @param params
 * @url param.url url запроса
 * @body param.body тело запроса может быть только объект new FormData
 * @dataType param.dataType тип возвращаемых данный (при неоходимости распарсить ответ в JSON - передать значение "json")
 * @success param.success callback функция в случае удачного запроса
 * @error param.error callback функция в случае ошибки запроса
 */

export const sendForm = (params) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", params.url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (params.contentType){
        xhr.setRequestHeader("Content-Type", params.contentType);
    }
    xhr.send(params.body);
    xhr.onreadystatechange = () => requestCallBack(xhr, params);
};

/**
 * @param input DOMObject
 * @returns {number}
 */
export const getCaretPosition = (input) => {
    let iCaretPos = 0;
    if (document.selection) {
        input.focus();
        const oSel = document.selection.createRange();
        oSel.moveStart("character", -input.value.length);
        iCaretPos = oSel.text.length;
    }
    else if (input.selectionStart || input.selectionStart === 0)
        iCaretPos = input.selectionStart;
    return iCaretPos;
};

/**
 * @param input DOMObject
 * @param caretPos number
 */
export const setCaretPosition = (input, caretPos = 0) => {
    if (input.createTextRange) {
        const range = input.createTextRange();
        range.move("character", caretPos);
        range.select();
    } else {
        input.focus();
        input.selectionStart && input.setSelectionRange(caretPos, caretPos);
    }
};

/**
 * @param func {Function} - callback function that is called after wait time
 * @param wait {Number} - timeout
 * @param immediate {Boolean} - first immediate run
 */
export const debounce = (func, wait, immediate = null) => {
    let timeout;
    return () => {
        const context = this, args = arguments;

        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/**
 *
 * @param callback
 * @param wait
 * @param context
 */
export const throttle = (callback, wait, context = this) => {
    let timeout = null;
    let callbackArgs = null;

    const later = () => {
        callback.apply(context, callbackArgs);
        timeout = null;
    };

    return function() {
        if (!timeout) {
            callbackArgs = arguments;
            timeout = setTimeout(later, wait)
        }
    }
};

export const sendFetch = ({url, method = "GET", headers = {}, body})=> {
    const options = {
        method,
        headers,
        body,
        credentials: 'same-origin'
    };

    if (!options.headers["x-requested-with"]) {
        options.headers["x-requested-with"] = "XMLHttpRequest";
    }

    return fetch(url, options);
};

/**
 * @param element DomObject
 * @param time Number
 */
export const scrollAnimateToElementDown = (element, time) => {
    const scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    const clientHeight = document.documentElement.clientHeight;
    const offsetElem = offsetTop(element);
    const scrollStep = offsetElem / (1000 / time);
    const scrollInterval = setInterval(() => {
        const scrollPosition = Math.round(window.scrollY);
        if ( (scrollPosition + clientHeight === scrollHeight) || (scrollPosition >= offsetElem)) {
            clearInterval(scrollInterval);
        }
        else if (scrollPosition !== offsetElem) {
            window.scrollBy(0, scrollStep);
        }
        else {
            clearInterval(scrollInterval);
        }
    },time);
};


export const onValidTextWithoutQuotes = (string, fieldName) => {
    const notValidElements = ["'", '"'];
    let isValid = false;
    if(notValidElements.some( element => string.indexOf(element) > -1 )) {
        isValid = true;
    }

    return {
        error: isValid,
        errorMessage:  isValid ? `The field ${fieldName} has " ' " or " " "` : "",
    };
};

const emptyText = (fieldName) => `Field ${fieldName} is Empty`;
const wrongEmail = "Field Email has wrong email address";
const wrongPasswordLength = "Password must has lenght more than 6 symbols";
const selectErrorText ="Choose your country please in field Country";
const checkFieldsetText ="Enter your male in field Sex";
const wrongDate = "Unknown format date, (dd/mm/yyyy)";

export const onEmpty = (value, fieldName) => {
    const isEmpty = !trim(value);

    return {
        error: isEmpty,
        errorMessage: isEmpty ? emptyText(fieldName)  : "",
    };
};

export const onEmail = (email, fieldName) => {
    const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = regExp.test(email);

    const onEmptyCheckResult = onEmpty(email, fieldName);

    return {
        error: !isValid,
        errorMessage: onEmptyCheckResult.error ? onEmptyCheckResult.errorMessage : !isValid ? wrongEmail : "",
    };
};

export const onDate = (date, fieldName) => {
    const regExp = /(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/;
    const isValid = regExp.test(date);
    const onEmptyCheckResult = onEmpty(date, fieldName);

    return {
        error: !isValid,
        errorMessage: onEmptyCheckResult.error ? onEmptyCheckResult.errorMessage : !isValid ? wrongDate : "",
    };
};

export const checkFieldset = (listOfItems) => {
    let isValid = false;
    listOfItems.forEach((item) => {
        if (item.checked === true) {
            return isValid = true
        }
    });

    return {
        error: !isValid,
        errorMessage: !isValid ? checkFieldsetText : "",
    };
};

export const onCheckSelect =  (currentValue, defaultValue) => {
    const isValid = currentValue != defaultValue;


    return {
        error: !isValid,
        errorMessage: !isValid ? selectErrorText: ""
    }
};

export const onPhoneNumber = (stringNumber, RegExpCustom = null) => {
    const regExp = RegExpCustom ? RegExpCustom : numberRegExp;
    const isValid = regExp.test(stringNumber);
    const onEmptyCheckResult = onEmpty(stringNumber);

    return {
        error: !isValid,
        errorMessage: onEmptyCheckResult.error ? onEmptyCheckResult.errorMessage : !isValid ? wrongPhone : "",
    };
};

export const onPassword = (string, fieldName) => {
    const checkEmptyPassword = onEmpty(string, fieldName);
    const isValid = string.length >= 6;
    return {
        error: !isValid,
        errorMessage: checkEmptyPassword.error ? checkEmptyPassword.errorMessage : !isValid ? wrongPasswordLength : "",
    };
};
