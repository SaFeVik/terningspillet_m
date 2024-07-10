let terningEl = document.querySelector('#terning')
let redemptionBtn = document.querySelector('#redemption')
let straffeBtn = document.querySelector('#straffekast')
let timerBtn = document.querySelector('#timer')
let comEl = document.querySelector('#com')
let bodyEl = document.getElementsByTagName('body')[0]

let sangerEls = document.querySelectorAll('.sang')

let sangvalgEl = document.querySelector('#sangvalg')

let reglerBtn = document.querySelector('#regler')
let reglerEl = document.querySelector('#reglerTxt')


let tidSanger = {
    "fireballAu": 31.6,
    "opusAu": 224,
    "skallebank2024Au": 131.8,
    "meandyourmamaAu": 122.4
}

// let sangEl = sangerEls[Math.floor(Math.random() * sangerEls.length)] */

let sangEl

terningEl.addEventListener('click', kast)
redemptionBtn.addEventListener('click', redemption)
timerBtn.addEventListener('click', timer)
straffeBtn.addEventListener('click', straffekast)

reglerBtn.onclick = function(){
    reglerEl.classList.toggle('vis')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Liste over terningbildene
let terninger = ['en', 'to', 'tre', 'fire', 'fem', 'seks']

let terningNr = Math.floor(Math.random()*6)
terningEl.src = `./filer/terninger/${terninger[terningNr]}.png`

// Kaster terningen
async function kaster(){
    terningEl.removeEventListener('click', kast)
    // Rullerer gjennom terninger imens kast
    for(i=50; i<250; i=i+50){
        let midlTerningNr = Math.floor(Math.random()*6)
        terningEl.src = `./filer/terninger/${terninger[midlTerningNr]}.png`
        terningEl.classList.toggle('rist')
        terningNr = midlTerningNr
        await sleep(i)
    }

    // Hvis triller 1 eller 6 står det "neste person"
    if(terningNr == 0 || terningNr == 5){
        comEl.innerHTML = `Gi terningen videre!`
    }
    terningEl.addEventListener('click', kast)
}
async function kast(){
    if (canRoll == true){
        console.log("kaster nu")
        // Hvis timeren er på vil den kaste
        comEl.innerHTML = `Kast 6 eller 1`
        await kaster()
    }

}

// Legg til en timeupdate-hendelse
function checkTime(){
    let elapsed = (performance.now() - startTime) / 1000
    let currentTime = startCurrentTime + elapsed
    console.log("songTime",Math.round(sangEl.currentTime*10)/10)
    console.log("realTime",Math.round(currentTime*10)/10) 
    console.log("mål",tidSanger[sangEl.id]);
    console.log("-------")
    if (currentTime >= tidSanger[sangEl.id]) {
        bodyEl.style.backgroundColor = "rgb(57, 137, 90)"

        comEl.innerHTML = `Drop!`
        timerBtn.innerHTML = "start timer"
        timerBtn.style.opacity = "1"
        terningEl.style.opacity = "0.5"
        timerBtn.addEventListener('click', timer)
        // Lov å bruke redemption
        redemptionBtn.style.display = 'block'
        timerBtn.style.display = 'none'
        canRoll = false
    }else{
        requestAnimationFrame(checkTime)
    }
};


let startTime
let startCurrentTime
let canRoll = false
async function timer(){
    canRoll = true
    straffesum = 0
    // Ikke mulig å skru på timer
    timerBtn.removeEventListener('click', timer)
    timerBtn.innerHTML = "Heia!"
    timerBtn.style.opacity = "0.5"
    // Mulig å kaste
    bodyEl.style.backgroundColor = "rgb(175, 75, 75)"
    comEl.innerHTML = `Kast 6 eller 1`
    sangEl = sangerEls[sangvalgEl.value]
    sangEl.currentTime = 0
    startTime = performance.now();
    startCurrentTime = sangEl.currentTime;
    sangEl.play()
    requestAnimationFrame(checkTime)
}
// Redemption kast
async function redemption(){
    terningEl.style.opacity = "1"
    await kaster()
    console.log(`TerningNr = ${terningNr}`)
    if(terningNr > 0 && terningNr < 5){
        comEl.innerHTML = `Du tapte!`
        straffeBtn.style.display = 'block'
        redemptionBtn.style.display = 'none'
        bodyEl.style.backgroundColor = "rgb(187, 137, 49)"
    }
    terningEl.style.opacity = "0.5"
}
let straffesum

async function straffekast(){
    terningEl.style.opacity = "1"
    console.log(`straffesum = ${straffesum}`)
    await kaster()
    straffesum += terningNr+1
    if(terningNr == 5){
        comEl.innerHTML = `Kast igjen!`
        terningEl.style.opacity = "0.5"
    }
    else if (terningNr == 0){
        comEl.innerHTML = `Du må downe glasset!`
        straffeBtn.style.display = 'none'
        timerBtn.style.display = 'block'
    }
    else{
        comEl.innerHTML = `Du må ta ${straffesum} slurker!`
        straffeBtn.style.display = 'none'
        timerBtn.style.display = 'block'
    }
}

