/////////////////////////////////////////////////////////////
// RECUPERATION DU HTML
/////////////////////////////////////////////////////////////
const bouton_start = document.getElementById("box_animation");
const bouton_start_texte = document.getElementById("box_animation_text");
const question = document.getElementById("question");
const high_score_value = document.getElementById("high_score_value");
const high_score = document.getElementById("high_score");
const rejouer = document.getElementById("rejouer");
let meilleur_score = [];
/////////////////////////////////////////////////////////////
// PROGRAMME PRINCIPAL
/////////////////////////////////////////////////////////////

game()

/////////////////////////////////////////////////////////////
// FONCTION ANIMATION AVANT JEU
/////////////////////////////////////////////////////////////

function getBestTime(){
    const bestTime =  JSON.parse(localStorage.getItem('bestTime'))
    if(bestTime){
        return bestTime
    }else{
        return 9999999999999
    }
    
}


//////////////////////////////////////////// Programme principal
function game()
{
    listener_animation_start()
    listener_reinitialisation()
}

//////////////////////////////////////////// Application des listener
// Listener du bouton start pour lancer le jeu
function listener_animation_start()
{
    bouton_start.addEventListener("click", animation, true)
}

// Listener du bouton replay pour réinitialiser le jeu
function listener_reinitialisation()
{
    rejouer.addEventListener("click", reinitialisation, true)
}
//////////////////////////////////////////// Animation d'avant jeu
function animation()
{
    // On remove le listener
    bouton_start.removeEventListener("click", animation, true)

    // On fixe la boite
    fixation_boite()

    // On fait disparaitre le bouton start
    disparition_start()

    // On fait apparaitre le décompte
    decompte_all()
}

////////// Fonction pour fixer la couleur du fond  
function fixation_boite()
{
    bouton_start.style.backgroundColor = "rgba(255, 134, 156, 0.764)";
}

////////// Fonction pour faire disparaitre le bouton start 
function disparition_start()
{
    // On efface le mot start en injectant une classe animation de disparition
    bouton_start_texte.classList.add("start_disparition");

    // A la fin de l'animation ( 1seconde )
    setTimeout(() => 
    {
        // On fait disparaitre le texte
        bouton_start_texte.style.display = "none";
    }, 900)
}

////////// Fonction pour gérer le décompte 3 - 2 - 1 
// Pour une animation
function decompte_patern(timeout, texte, i)
{
    
    setTimeout(() => {
    bouton_start_texte.style.display = "none";
    }, timeout);

    // Après un certain temps après la fin de l'animation
    setTimeout(()=>
    {
        if(i!=3)
        {
            // On change la valeur du texte
            bouton_start_texte.innerHTML = texte;

            // On retire sa classe
            bouton_start_texte.classList.remove("start_disparition");

            // On lui ajoute une nouvelle classe animation decompte_apparition
            bouton_start_texte.classList.add("decompte_apparition");

            // On rend le texte visible
            bouton_start_texte.style.display = "flex"

            // On ajuste la taille de la police ( pour qu'elle soit plus grand qu'a l'origine)
            bouton_start_texte.style.fontSize = "55px";
        }
        else
        {
            // Quand la résolution arrive ( fin de l'animation, on lance le jeu)
            game_begin_animation().then(function()
            {
                // On lance le jeu
                game_start()
            }) 
        }
        
    }, timeout + 50)
    
    
}
// Pour toutes les animations
function decompte_all()
{
    let timeout = 1050 // Délai avant l'apparition du 3
    let texte = 3

    for(let i=0 ; i<4 ; i++)
    {
        decompte_patern(timeout, texte, i)
        timeout += 800 // Temps entre chaque animation
        texte -= 1
    }
}



////////// Fonction pour lancer l'animation jeu à la fin du décompte
function game_begin_animation()
{
    // Promesse de résolution
    return new Promise((resolve) => 
    {
        // On injecte la classe d'animation de lancement du jeu
        bouton_start.classList.add("game_begin_animation");

        // On ajoute un listener sur l'animation, quand elle prend fin on lance la résolution
        bouton_start.addEventListener("animationend", resolve, true)
        setTimeout(() => {
            bouton_start.removeEventListener("animationend", resolve, true)
        }, 2000);
    })
}

////////// Fonction pour lancer le jeu ( enfin )
function game_start()
{
    // On supprimer les listener
    bouton_start.removeEventListener("click", animation, true)
    // Lancement du jeu
    jeu()
}



/////////////////////////////////////////////////////////////
// FONCTION PENDANT LE JEU
/////////////////////////////////////////////////////////////

////////// Fonction coeur du jeu
function jeu()
{
    let moment_apparition = 0
    // On défini un délai avant le lancement de l'écran vert
    let delai_apparition =  Math.random() * (5000 - 2000) + 2000

    // On lance le décompte avant l'écran vert
    let delai_avant_ecran_vert = setTimeout(() => {

        // On met le bouton en vert
        bouton_start.style.backgroundColor = "rgb(102, 191, 102)";

        // On récupère le TimeStamp en ms du moment ou il s'affiche
        moment_apparition = Date.now();

    }, delai_apparition);

    // On écoute le clic de l'utilisateur
    setTimeout(() => {

        function declenchement()
        {
            evenement_clique(delai_avant_ecran_vert, moment_apparition);

            setTimeout(() => {
                bouton_start.removeEventListener("click", declenchement, true);
            }, 0);
        }

        bouton_start.addEventListener("click", declenchement, true)

    }, 0);
}

////////// Fonction lorsque l'utilisateur clique
function evenement_clique(delai_avant_ecran_vert, moment_apparition)
{
    // On retirer le décompte de l'écran vert
    clearTimeout(delai_avant_ecran_vert);

    // On détermine si l'utilisateur a cliquer trop tôt ou non
    trop_tot_ou_pas(moment_apparition);
}

////////// Fonction pour déterminer si l'utilisateur clique avant ou après
function trop_tot_ou_pas(moment_apparition)
{
    // On vérifie la couleur du bouton au moment du clique

    // Si le bouton n'est pas vert
    if(bouton_start.style.backgroundColor != "rgb(102, 191, 102)")
    {
        // On change le texte
        bouton_start_texte.innerHTML = "Trop tôt !";

        // On affiche le texte
        bouton_start_texte.style.display = "";

        // On injecte une classe d'animation animation_question_apparition
        question.classList.add("animation_question_apparition")

        // On affiche les question
        question.style.display = "flex";
    }

    // Si le bouton est vert
    else
    {
        // On récupère le TimeStamp au moment du clique
        let moment_clique = Date.now()

        // On calcule la différence entre les deux timestamps, on divise par 1000 pour avoir des secondes
        let temp_de_reaction = ((moment_clique - moment_apparition) / 1000).toFixed(3)

        // On change le texte
        bouton_start_texte.innerHTML = temp_de_reaction+" secondes";

        // On affiche le texte
        bouton_start_texte.style.display = "";

        //////// question de fin de jeu
        // on retire l'eventuelle classe anitmation_question_disparition
        question.classList.remove("animation_question_disparition");
        // On injecte une classe d'animation animation_question_apparition
        question.classList.add("animation_question_apparition");
        
        // On affiche les question
        question.style.display = "flex";

        controle_meilleur_score(temp_de_reaction)
    }
}

/////////////////////////////////////////////////////////////
// FONCTION FIN DE JEU
/////////////////////////////////////////////////////////////

////////// Fonction pour mettre à jour le meilleur score
function controle_meilleur_score(x)
{
    // On envoie le nouveau resultat dans le tableau
    meilleur_score.push(x);
    
    // On récupère la valeur la plus courte
    let plus_courte_reaction = Math.min(...meilleur_score);

    // On reset le tableau
    meilleur_score = [];

    // On lui reaffecte la valeur la plus courte
    meilleur_score.push(plus_courte_reaction);

    

    // On Récupère la valeur stocker dans le localStorage
    const bestTimeInLocalStorage = getBestTime()

    // Si cette valeur est plus grande que le nouveau score
    if(bestTimeInLocalStorage > plus_courte_reaction){
        // On sauvegarde le noueau score dans le cache
        localStorage.setItem("bestTime", plus_courte_reaction)
    }

    // On affiche le score stocker dans le localStorage
    high_score_value.innerHTML = getBestTime();

    
}

////////// Fonction pour tout réinitialiser
function reinitialisation()
{
    function preambule()
    {
        return new Promise((resolu_2) => 
        {
            // On fait disparaitre les bouton question
            question.classList.remove("animation_question_apparition");
            question.classList.add("animation_question_disparition");

            setTimeout(() => {
                question.classList.remove("animation_question_disparition");
            }, 2000);

            // On injecte une classe d'animation pour remettre la boite à sa bonne taille
            bouton_start.classList.add("animation_reinitialisation");
            setTimeout(() => {
                bouton_start.classList.remove("animation_reinitialisation");
            }, 2000);

            // On injecte une classe d'animation pour faire disparaitre le texte
            bouton_start_texte.classList.add("disparition_opacity");
            // On supprime cette classe un peu après
            setTimeout(() => {
                bouton_start_texte.classList.remove("disparition_opacity");
            }, 2000);

            // Quand la boite ( en une seconde ) s'est remis à sa bonne taille
            setTimeout(() => {

                // On change le texte du bouton
                bouton_start_texte.innerHTML = "START";

                // On injecte une classe d'animation pour faire apparaitre le START
                bouton_start_texte.classList.add("apparition_opacity");
                // On supprime cette classe un peu après
                setTimeout(() => {
                    bouton_start_texte.classList.remove("apparition_opacity");
                }, 2000);

                // On résou la promesse
                resolu_2()
            }, 1000);
        })
    }

    // Quand la promesse est faite
    preambule().then(() => 
    {
        bouton_start.style.backgroundColor = "pink";
        // On remet en display none les questions
        question.style.display = "none";

        // On supprime toutes les classes superflue
        bouton_start_texte.classList.remove("decompte_apparition");
        bouton_start.classList.remove("game_begin_animation");
        
        
        // On réapplique un listener pour le bouton start
        listener_animation_start()
    })

}
