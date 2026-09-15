function alternarGuia(event, idGuia){
    event. preventDefault();

    const guias = document.querySelectorAll('.guia');
    const conteudos = document.querySelectorAll('.conteudo-guia');

    guias.forEach(function(guia){
        guia.classList.remove("selecionada");
    });
    conteudos.forEach(function(conteudo){
        conteudo.classList.remove("ativa");
    });
        event.currentTarget.classList.add("selecionada");
        document.getElementById(idGuia).classList.add("ativa");
    } 

    function trocarTema(){
        const html = document.documentElement;
        const btnTema = document.getElementById("theme-toggle");
        const iconeTema = document.getElementById("theme-icon");
        const temaSalvo = localStorage.getItem("data-theme");

        if(temaSalvo !== null){
            html.setAttribute("data-theme",temaSalvo);
            if(temaSalvo === 'light'){
                iconeTema.textContent = "light_mode";
            }else{
                iconeTema.textContent = "dark_mode";
            }
        }

       btnTema.addEventListener('click', () =>{
        const temaAtual = html.getAttribute("data-theme");
            if(temaAtual === 'light'){
                html.setAttribute("data-theme","dark");
                localStorage.setItem("data-theme","dark");
                iconeTema.textContent = "dark_mode";
            }else{
                html.setAttribute("data-theme","light");
                localStorage.setItem("data-theme","light");
                iconeTema.textContent = "light_mode";
            }
        }
        )
    }

    trocarTema();