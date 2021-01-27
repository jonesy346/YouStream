// import React from 'react';
// import "./Instructions.css";

// export default function Instructions() {
//     const openInstructionsButtons = document.querySelectorAll("[data-modal-target]");
//     const closeInstructionsButtons = document.querySelectorAll("[data-close-button]");
//     const overlay = document.getElementById("overlay");

//     openInstructionsButtons.forEach((button) => {
//         button.addEventListener('click', () => {
//             const modal = document.querySelector(button.dataset.modalTarget);
//             openModal(modal);
//         });
//     });

//     const openModal = (modal) => {
//         if(modal == null) return
//         modal.classList.add("active");
//         overlay.classList.add("active");
//     }


//     return (
//         <div>
//             <button data-modal-target="#modal">Instructions</button>
//             <div className="instructions" id="instructions">
//                 <div className="header">
//                     <div className="title">Example modal</div>
//                     <button data-modal-button className="close-button">&times;</button>
//                 </div>
//                 <div className="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in eleifend tellus. Cras maximus dignissim commodo. Praesent sagittis justo eget volutpat rhoncus. Suspendisse tortor eros, aliquet et aliquam et, ultrices sit amet dolor. Proin elit augue, gravida ornare aliquam id, imperdiet non sem. Integer sed elementum nibh. Duis sed eros nunc. Duis eget convallis neque, porta pretium eros. Phasellus feugiat pellentesque ligula eu ultrices. Etiam lacinia urna erat, nec porttitor mi gravida ac. Nam ornare gravida varius. Morbi ac hendrerit odio. Suspendisse sed suscipit est. Aliquam porttitor porta ante, ac placerat magna ornare ac.</div>
//             </div>
//             <div className="active" id="overlay"></div>
//         </div>
//     )
// }
