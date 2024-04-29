
function getApiUrl() {
    return "http://localhost:8000";
}


// Typing bakery code
function writeBakeryCode(event, elem, code) {
    const resultCode = document.getElementById('resultCode');
    const currentCode = resultCode.innerText;
    const currentCodeSplit = currentCode.split('-');

    var newCode = "";
    var index = 1;
    for(customCode of currentCodeSplit) {
        if (index == code) {
            newCode += elem.value;
            if (index !== 1 && elem.value.length < 4) {
                for (let i = elem.value.length+1; i <= 4; i++) {
                    newCode += "x";
                }
            } else if (index == 1 && elem.value.length == 0) {
                newCode += "x";
            }
        } else {
            newCode += customCode;
        }
        if (index < currentCodeSplit.length) {
            newCode += "-";
        }
        index++;
    }

    resultCode.innerText = newCode;

    if (code !== 5 && code != 1) {
        if (elem.value.length == 4) {
            document.getElementById('code' + (code+1)).focus();
        }
    }
    if (code !== 1 && elem.value.length == 0) {
        if (event.key == "Backspace") {
            document.getElementById('code' + (code-1)).focus();
        }
    }

    if (code !== 1) {
        if (event.key == "ArrowLeft") {
            document.getElementById('code' + (code-1)).focus();
        }
    }
    if (code !== 5) {
        if (event.key == "ArrowRight") {
            document.getElementById('code' + (code+1)).focus();
        }
    }
}

// Verif if the resultCode is the same as the code in the input
function verifSimilarCode() {
    const resultCode = document.getElementById('resultCode').innerText;

    const code1 = document.getElementById('code1').value;
    const code2 = document.getElementById('code2').value;
    const code3 = document.getElementById('code3').value;
    const code4 = document.getElementById('code4').value;
    const code5 = document.getElementById('code5').value;

    const code = code1 + "-" + code2 + "-" + code3 + "-" + code4 + "-" + code5;

    if (resultCode == code) {
        return true;
    } else {
        return false;
    }
}

// Valid the bakery code
function validBakeryCode() {
    const resultCode = document.getElementById('resultCode').innerText;
    
    verif = verifSimilarCode();
    if (verif === false) {
        return;
    }

    apiUrl = getApiUrl();

    $.ajax({
        type: 'POST',
        dataType:"json",
        url: apiUrl+'/api/code_accesses/verif?code='+resultCode,
        headers:{   
            'accept' : 'application/ld+json',
            'Content-Type' : 'application/ld+json'
        },
        data: `{}`,
        success: function(result, status, xhr) {
            if (result.result == "code-access-valid") {
                window.location.href="rating.html?code="+resultCode+"&id="+result.candidate;
            }
            return;
        },
        error: function(xhr, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

function putNote(type, level) {
    // TODO: Faire la prise en charge du type
    for (let y = 1; y <= 5; y++) {
        idElem = 'star-'+y;
        const starElem = document.getElementById(idElem);

        if (y <= level) {
            starElem.classList.add('gold');
        } else {
            starElem.classList.remove('gold');
        }
        document.getElementById('note').value = level;
    }
}


// COOKIE
function addToCookie(cookieName, valueToAdd) {
    document.cookie = cookieName + "=" + valueToAdd;
}
function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    
    return null;
}
function deleteCookie(cookieName) {
    if (cookieName == "all") {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}
function destroyCookie() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


// URI
function getParamUri() {
    var parts = window.location.search.substr(1).split("&");
    var getVar = {};
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        getVar[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    return getVar;
}
if (getParamUri().showApiKey == "true") {
    if (getCookie('apiKey') != null) {
        showApiKey();
    }
}


// MODAL
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
window.onclick = function(event) {
    if (event.target.className == "modal") {
        event.target.style.display = "none";
    }
}