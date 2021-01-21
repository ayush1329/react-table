import React, { useState } from "react";
import './autoSuggestion.css';

const AutoSuggestion = () => {

    const [showAuto, setAuto] = useState(false);
    const [textDesc, setText] = useState("");
    const [posTop, setPosTop] = useState(0);
    const [posLeft, setPosLeft] = useState(0);

    const onChangeText = (event) => {
       setText(event.target.value);
    }

    const onCharacterPress = (event) => {
        console.log(window)
        if(event.keyCode === 50 || event.keyCode === 51) {
           setAuto(true);
           getPosition(event);
        } else if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 8) {
            setAuto(false);
        } 
    }

    const getPosition = (event) => {
        var dom = document.createElement('div');
        dom.setAttribute("id", "div1");
        dom.innerHTML = event.target.defaultValue;
        console.log(dom);
        var ctl = document.getElementById('auto-suggestion');
        console.log(ctl.childNodes);

    //     var rect = ctl.getBoundingClientRect();
    //     console.log(rect);
    //   var x = ctl.clientX - rect.left; //x position within the element.
    //   var y = ctl.clientY - rect.top;  //y position within the element.
    //   console.log("Left? : " + x + " ; Top? : " + y + ".");
        // console.log(ctl.value.substring(0, ctl.selectionStart));

        var startPos = ctl.selectionStart;
        var endPos = ctl.selectionEnd;
        setPosTop(startPos);
        setPosLeft(endPos);


//         const range = document.createRange();
// range.setStartBefore(100, 0);
// range.setEndAfter(200, 0);

// const clientRect = range.getBoundingClientRect();
// const highlight = document.getElementById('suggest');
// highlight.style.left = `${clientRect.x}px`;
// highlight.style.top = `${clientRect.y}px`;
// highlight.style.width = `${clientRect.width}px`;
// highlight.style.height = `${clientRect.height}px`;
    }

 return (
     <div className="row mx-0 p-5" style={{marginBottom: 100}}>
         <div className="main-comp">
         <div className="editor-section w-100">
             <textarea id="auto-suggestion" className="form-control" placeholder="Type Rule" value={textDesc} type="text" onKeyDown={($event) => onCharacterPress($event)} onChange={($event) => onChangeText($event)}></textarea>
             {/* <div id="auto-suggestion"> 
                <div id="main-div" contentEditable="true" className="form-control" placeholder="Type Rule" value={textDesc} type="text" onKeyDown={($event) => onCharacterPress($event)} onChange={($event) => onChangeText($event)}>

                </div>
             </div> */}
         </div>
         <div id="suggest" className={`row m-0 auto-suggestion ${showAuto ? "show" : ""}`} style={{top: posTop , left: posLeft}}>
             <ul className="list-group">
                 <li className="list-group-item">AYush</li>
                 <li className="list-group-item">AYush</li>
                 <li className="list-group-item">AYush</li>
                 <li className="list-group-item">AYush</li>
                 <li className="list-group-item">AYush</li>
                 <li className="list-group-item">AYush</li>
             </ul>
         </div>
         </div>
     </div>
 )
}

export default AutoSuggestion;