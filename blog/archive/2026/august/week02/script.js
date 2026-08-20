const stickers =
document.querySelectorAll(".sticker");


const messages =
document.getElementById("messages");



stickers.forEach(sticker=>{


sticker.addEventListener(
"click",
()=>{


const text =
sticker.dataset.message;



const bubble =
document.createElement("div");


bubble.className="message";


bubble.innerText =
text;



messages.appendChild(bubble);



}
);


});
