
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
function validBakeryCode(btn) {
    const dpError = document.getElementById('dpError');

    btn.disabled = true;
    btn.innerText = "Chargement...";

    const resultCode = document.getElementById('resultCode').innerText;
    
    verif = verifSimilarCode();
    if (verif === false) {
        btn.disabled = false;
        btn.innerText = "Valider";
        dpError.innerText = "Le code entré n'est pas valide";
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
            } else if (result.result == "code-not-gived") {
                dpError.innerText = "Le code entré n'est pas disponible";
            } else if (result.result == "code-already-used") {
                dpError.innerText = "Ce code a déjà été utilisé";
            } else {
                dpError.innerText = "Le code entré n'est pas valide";
            }
            btn.disabled = false;
            btn.innerText = "Valider";
            return;
        },
        error: function(xhr, error) {
            btn.disabled = false;
            btn.innerText = "Valider";
            dpError.innerText = "Le code entré n'est pas valide";
            console.log(error);
            console.log(xhr);
        }
    });
}

// Add a bakery rating in the rating page
function putNote(type, level) {
    for (let y = 1; y <= 5; y++) {
        idElem = 'star-'+type+'-'+y;
        const starElem = document.getElementById(idElem);

        if (y <= level) {
            starElem.classList.add('gold');
        } else {
            starElem.classList.remove('gold');
        }
    }
    document.getElementById(type+'Note').value = level;
}

// Send the bakery rating
function sendBakeryRating() {
    const code = getParamUri().code;
    const candidate = getParamUri().id;

    if (candidate !== candidate.substring(0, 1)) {
        console.log("Error: candidateURi is not valid");
        return;
    }

    const companyNote = document.getElementById('companyNote').value;
    const productNote = document.getElementById('productNote').value;
    const priceNote = document.getElementById('priceNote').value;
    const staffNote = document.getElementById('staffNote').value;

    const data = `
        {
            "companyRating": `+companyNote+`,
            "productRating": `+productNote+`,
            "priceRating": `+priceNote+`,
            "staffRating": `+staffNote+`
        }
    `;
    apiUrl = getApiUrl();
    $.ajax({
        type: 'POST',
        dataType:"json",
        url: apiUrl+'/api/ratings?code='+code,
        headers:{
            'accept' : 'application/ld+json',
            'Content-Type' : 'application/ld+json'
        },
        data: data,
        success: function(result, status, xhr) {
            if (result.result == "code-already-used") {
                window.location.href="index.html?rating=code-already-used";
            } else if (result.result == "rating-not-posted") {
                console.log("Error: rating not posted");
                return;
            } else if (result.result == "code-not-gived") {
                window.location.href="index.html?rating=code-not-gived";
            } else if (result.result == "rating-posted") {
                window.location.href="index.html?rating=posted";
            }
        },
        error: function(xhr, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

// Check the status of the rating
function checkRatingStatus() {
    const dpError = document.getElementById('dpError');
    const dpSuccess = document.getElementById('dpSuccess');

    const rating = getParamUri().rating;
    if (rating == undefined) {
        return false;
    }

    if (rating == "posted") {
        dpSuccess.innerText = "Votre avis a bien été enregistré";
    }
    return true;
}


// ONLOAD
window.onload = function() {
    const ratingStatus = checkRatingStatus();
    if (ratingStatus === true) {
        setTimeout(function() {
            window.location.href="index.html";
        }, 3000);
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