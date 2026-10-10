function play(id) {
    const figure = document.getElementById(id);
    

    const iframe = figure.querySelector("iframe");
   
    let src = iframe.getAttribute("src");
    src = src.replace(/\?autoplay=1|&autoplay=1/, "");
    iframe.setAttribute("src", src + "?autoplay=1");
}
window.onload=function(){

    //pun in local storage cu parsare
    let li= document.getElementsByTagName("li");
    for(let i=0; i< li.length;i++){
        if(!li[i].querySelector("ul")){
             li[i].onclick=function(e){   
                    e.currentTarget.style.backgroundColor = "crimson";
                    let select= JSON.parse(localStorage.getItem("selectedItems") )|| [];
                    let id= e.currentTarget.textContent;
                    if(!select.includes(id)){
                        select.push(id);
                    }
                    localStorage.setItem("selectedItems",JSON.stringify(select));
                }
             li[i].ondblclick = function(e){
                e.stopPropagation();
                e.target.remove();
             }
            };

       
    }
    //preia din local storage
    let selected= JSON.parse(localStorage.getItem("selectedItems")) || [];
    for(let i=0; i< li.length;i++){

        if(selected.includes(li[i].textContent)){
            li[i].style.backgroundColor = "crimson";
        }
    }

    //temp fix pun butonul de sfaturi
    function sfaturi(){
        
        let div = document.querySelector(".info");
        let buton= document.createElement("button");
        div.appendChild(buton);
        buton.setAttribute("id","buton");
        buton.innerHTML = "Apasa aici pentru a vedea niste sfaturi"
        buton.addEventListener("click",function(){
            
            buton.classList.add("ascunde");
            setTimeout(function(){
               buton.classList.remove("ascunde");
            },3000)
            fetch("plan.json").then(function(response){
                if(response.status == 200){
                    return response.json();
                }
            }).then(function(date){
                let indiceRAND = Math.floor(Math.random()*date.length);
                alert(`Sfat: ${date[indiceRAND].mesaj}`) ;
            }).catch(function(err){
                alert("Eroare");
            })
        })
    }
    sfaturi();   
}
    //sesiune login-logout
    function afisarelogin(){
    let login = document.getElementById("login");
    
    login.innerHTML = `
        <h3>Login</h3>
        <form id="logform">
            <input type="text" id="user" placeholder="Utilizator"><br><br>
            <input type="password" id="pass" placeholder="Parola"><br><br>
            <button type="submit" id="submit">Login</button>
        </form>
        <p id="eroare"></p>
    `;
    let style =getComputedStyle(login);
    login.style.backgroundColor ="rgb(241, 15, 15)";
    login.style.fontFamily=" 'Stack Sans Notch', sans-serif";
    

    let l=document.getElementById("logform");
    let userin = document.getElementById("user");
    let passin= document.getElementById("pass");
    l.addEventListener("submit",function(e){
        let user=userin.value;
        let pass=passin.value;
        let userreg=/^[a-zA-Z0-9]{3,}$/;
        let passreg=/^.{4,}$/;
        if(!userreg.test(user) || !passreg.test(pass)){
            document.getElementById("eroare").textContent="Date invalide!";
            return;
        }
        localStorage.setItem("logat","true");
        localStorage.setItem("user", user);
        verificare();
    });
   userin.onkeypress = passin.onkeypress=function(e){
        if(e.key == "Enter"){
                l.requestSubmit();
        }
   };
}

function recenzie(){
    let recenzii= document.getElementById("recenzii");
    recenzii.innerHTML= `
        <h3>Recenzii</h3>
        <textarea id="Recenzie" placeholder="Va rog lasati o recenzie"></textarea><br><br>
        <button id="adauga">Adauga recenzie</button>
        <button id="logout">Logout</button>
        <ul id="ListaRecenzii"></ul>
    
    `;
    let style = getComputedStyle(recenzii);
    recenzii.style.backgroundColor ="rgb(241, 15, 15)";
    let lista= JSON.parse(localStorage.getItem("recenzii")) || [];
    let ul = document.getElementById("ListaRecenzii");
    for (let i=0; i< lista.length;i++){
        let review= document.createElement("li");
        review.textContent = `${lista[i].mesaj} (${lista[i].data})`;
        ul.appendChild(review);
    }
    document.getElementById("adauga").onclick = function(){
        let text  = document.getElementById("Recenzie").value;
        if(text.trim() ==""){
            return;
        }
        let recenzieNoua={mesaj:text,data: new Date().toLocaleString("ro-RO")};
        lista.push(recenzieNoua);
        localStorage.setItem("recenzii",JSON.stringify(lista));
        let li = document.createElement("li");
        li.textContent =`${recenzieNoua.mesaj}(${recenzieNoua.data})`;
        ul.appendChild(li);

    };
    document.getElementById("logout").onclick = function(){
        localStorage.removeItem("logat");
        localStorage.removeItem("user");
        verificare();
    }
   

}
 function verificare() {
    const login = document.getElementById("login");
    const recenzii = document.getElementById("recenzii");

    if (localStorage.getItem("logat") === "true") {
        login.style.display = "none";
        recenzii.style.display = "block";
        recenzie();
    } else {
        recenzii.style.display = "none";
        login.style.display = "block";
        afisarelogin();
    }
}
window.addEventListener("load",verificare);