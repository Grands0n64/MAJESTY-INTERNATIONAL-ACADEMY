(()=>{"use strict";
const $=id=>document.getElementById(id),root=$("ai-classroom-root");
if(!root)return;
const catalog=window.MAJESTY_TOPICS||{},storeKey="majestyClassroomV1";
let state={subject:"",topic:"",assignment:"",flags:[]};
try{state={...state,...JSON.parse(localStorage.getItem(storeKey)||"{}")}}catch{}
const save=()=>localStorage.setItem(storeKey,JSON.stringify(state));
const levels=["JSS 1","JSS 2","JSS 3","SS 1","SS 2","SS 3","100 Level","200 Level","300 Level","400 Level"];
const subjectsFor=level=>/^\d00 Level$/.test(level)?Object.values(window.MAJESTY_UNIVERSITY||{}).flatMap(ds=>Object.values(ds).flat()).filter((v,i,a)=>a.indexOf(v)===i):((window.MAJESTY_CURRICULUM||{})[level]||[]);
const topicsFor=s=>catalog[s]||["Course overview and learning objectives","Key concepts and terminology","Principles and explanations","Worked examples and applications","Practice, revision and assessment"];
const make=(tag,attrs={},text="")=>{const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>{if(k==="class")e.className=v;else if(k==="value")e.value=v;else e.setAttribute(k,v)});if(text)e.textContent=text;return e};
const button=(label,fn,cls="")=>{const b=make("button",{type:"button",class:cls},label);b.addEventListener("click",fn);return b};
const currentLevel=()=> $("level")?.value||$("auth-level")?.value||"JSS 1";
function render(){
 root.innerHTML="";
 const panel=make("div",{class:"panel ai-classroom"});
 const head=make("div",{class:"panelhead"});head.append(make("h2",{},"AI Virtual Classroom"),make("span",{},"Majesty International Academy"));panel.append(head);
 const intro=make("p",{class:"muted"},"Choose your level, subject and topic. Your AI teacher can explain the lesson, speak it aloud, answer questions and prepare practice assignments.");
 const controls=make("div",{class:"classroom-controls"});
 const level=make("select",{id:"class-level","aria-label":"Learning level"});levels.forEach(v=>level.append(make("option",{value:v},v)));level.value=currentLevel();
 const subject=make("select",{id:"class-subject","aria-label":"Subject or course"});
 const topic=make("select",{id:"class-topic","aria-label":"Lesson topic"});
 controls.append(level,subject,topic);
 const avatar=make("div",{class:"teacher-stage"});
 const face=make("div",{class:"teacher-avatar","aria-label":"Animated AI teacher"});face.append(make("div",{class:"teacher-hair"}),make("div",{class:"teacher-eyes"}),make("div",{class:"teacher-mouth"}));
 const speech=make("div",{class:"teacher-speech",id:"teacher-status"},"Hello! I'm your Majesty Academy AI teacher. Choose a topic and let's begin.");
 avatar.append(face,speech);
 const actions=make("div",{class:"teacher-actions"});
 const teach=button("Teach this topic",teachTopic);
 const speak=button("🔊 Read lesson aloud",speakLesson,"secondary");
 const stop=button("Stop voice",()=>window.speechSynthesis?.cancel(),"secondary");
 actions.append(teach,speak,stop);
 const question=make("textarea",{id:"class-question",rows:"3",placeholder:"Ask your AI teacher a question by typing here..."});
 const ask=button("Ask AI teacher",askTeacher);
 const lesson=make("div",{class:"answerbox",id:"class-lesson"},"Your lesson notes and examples will appear here.");
 const assignment=make("div",{class:"class-assignment"});
 assignment.append(make("h3",{},"AI assignment"),make("p",{class:"muted"},"Generate a lesson-based assignment, then complete it below."));
 const generate=button("Set an assignment",generateAssignment);
 const task=make("div",{id:"class-task",class:"answerbox"},"No assignment generated yet.");
 const answer=make("textarea",{id:"class-answer",rows:"5",placeholder:"Write your assignment answer here..."});
 const submit=button("Submit assignment for AI feedback",submitAssignment);
 const feedback=make("div",{id:"class-feedback",class:"answerbox"},"AI feedback will appear here.");
 assignment.append(generate,task,answer,submit,feedback);
 const integrity=make("div",{class:"integrity-panel"});
 integrity.append(make("h3",{},"Examination integrity monitor"),make("p",{class:"muted"},"Optional browser-based monitoring. It records tab changes, leaving the page and copy/paste attempts during an exam. It cannot see another device or prove cheating."));
 const consent=make("label",{class:"consent"});const check=make("input",{type:"checkbox",id:"integrity-consent"});consent.append(check,document.createTextNode(" I understand and consent to browser activity monitoring during this practice exam."));
 const start=button("Start monitored practice",startMonitor);const end=button("End monitoring",endMonitor,"secondary");const log=make("div",{id:"integrity-log",class:"answerbox"},"Monitoring is off.");
 integrity.append(consent,start,end,log);
 panel.append(intro,controls,avatar,actions,make("h3",{},"Ask your teacher"),question,ask,lesson,assignment,integrity);
 root.append(panel);
 function fillSubjects(){subject.innerHTML="";subjectsFor(level.value).forEach(s=>subject.append(make("option",{value:s},s)));if(!subject.options.length)subject.append(make("option",{value:""}, "No subjects found"));if(state.subject&&[...subject.options].some(o=>o.value===state.subject))subject.value=state.subject;fillTopics()}
 function fillTopics(){topic.innerHTML="";topicsFor(subject.value).forEach((t,i)=>topic.append(make("option",{value:t},(i+1)+". "+t)));if(state.topic&&[...topic.options].some(o=>o.value===state.topic))topic.value=state.topic;state.subject=subject.value;state.topic=topic.value;save()}
 level.addEventListener("change",fillSubjects);subject.addEventListener("change",fillTopics);topic.addEventListener("change",()=>{state.topic=topic.value;save()});fillSubjects();
 function setStatus(t){speech.textContent=t}
 async function callAI(prompt){const auth=window.MAJESTY_AUTH;if(!auth?.client||!auth.session)throw Error("Please sign in to use your live AI teacher.");const {data,error}=await auth.client.functions.invoke("ai-tutor",{body:{question:prompt,subject:subject.value,level:level.value}});if(error)throw error;if(data?.error)throw Error(data.error);return data?.answer||"The teacher could not prepare an answer."}
 function lessonPrompt(){return "Teach a complete structured lesson on: "+topic.value+". Subject: "+subject.value+". Level: "+level.value+". Include learning objectives, prerequisite knowledge, clear step-by-step explanation, key definitions, worked examples, common mistakes, a short recap and three check-for-understanding questions. Keep it age appropriate and accurate."}
 async function teachTopic(){teach.disabled=true;lesson.textContent="Your AI teacher is preparing the lesson...";setStatus("Preparing today's lesson. Please wait.");try{const a=await callAI(lessonPrompt());lesson.textContent=a;state.lastLesson=a;save();setStatus("Lesson ready. You can listen or ask me a question.");}catch(e){lesson.textContent=e.message;setStatus("I couldn't load the lesson.");}finally{teach.disabled=false}}
 async function askTeacher(){const q=question.value.trim();if(!q)return;ask.disabled=true;setStatus("Thinking about your question...");try{const a=await callAI("Answer this student's question clearly and step by step. If useful, give an example. Finish by checking understanding. Student question: "+q);lesson.textContent=a;setStatus("I've answered your question. Ask me another one anytime.");}catch(e){lesson.textContent=e.message;setStatus("I couldn't answer just now.");}finally{ask.disabled=false}}
 function speakLesson(){const text=lesson.textContent;if(!text||text.startsWith("Your lesson notes")){setStatus("Teach a topic first.");return}if(!("speechSynthesis"in window)){setStatus("Speech playback is not supported by this browser.");return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.92;u.onstart=()=>face.classList.add("speaking");u.onend=()=>face.classList.remove("speaking");u.onerror=()=>face.classList.remove("speaking");window.speechSynthesis.speak(u);setStatus("Reading the lesson aloud.");}
 async function generateAssignment(){generate.disabled=true;task.textContent="Your AI teacher is setting an assignment...";try{const a=await callAI("Create a suitable assignment for the topic "+topic.value+" in "+subject.value+" for "+level.value+". Set five questions mixing objective and short-answer questions, include clear instructions and a suggested deadline. Do not include the answers. Format as a numbered assignment.");state.assignment=a;task.textContent=a;save();setStatus("Your assignment is ready.");}catch(e){task.textContent=e.message;}finally{generate.disabled=false}}
 async function submitAssignment(){const response=answer.value.trim();if(!response){feedback.textContent="Write your answers before submitting.";return}submit.disabled=true;feedback.textContent="Your AI teacher is reviewing your work...";try{const a=await callAI("Review this student's assignment response. Give strengths, corrections, explanations and a provisional score out of 100. Do not call it an official grade. Assignment: "+(state.assignment||task.textContent)+" Student answer: "+response);feedback.textContent=a;const records=JSON.parse(localStorage.getItem("majestyClassroomSubmissions")||"[]");records.push({subject:subject.value,topic:topic.value,assignment:state.assignment,answer:response,feedback:a,submittedAt:new Date().toISOString()});localStorage.setItem("majestyClassroomSubmissions",JSON.stringify(records));setStatus("Your work has been reviewed. Feedback is displayed below.");}catch(e){feedback.textContent=e.message;}finally{submit.disabled=false}}
 let monitor=false,events=[];
 function flag(reason){if(!monitor)return;const entry={reason,at:new Date().toISOString(),topic:topic.value};events.push(entry);state.flags=events;save();log.textContent=events.map(x=>new Date(x.at).toLocaleTimeString()+" — "+x.reason).join("\n");}
 function startMonitor(){if(!check.checked){log.textContent="Please read and accept the monitoring notice first.";return}events=[];monitor=true;document.addEventListener("visibilitychange",visibility);window.addEventListener("blur",blur);document.addEventListener("copy",copy);document.addEventListener("paste",paste);log.textContent="Monitoring is active for this browser tab. Activity is recorded locally on this device."}
 function endMonitor(){monitor=false;document.removeEventListener("visibilitychange",visibility);window.removeEventListener("blur",blur);document.removeEventListener("copy",copy);document.removeEventListener("paste",paste);log.textContent=events.length?log.textContent:"Monitoring ended. No events were recorded."}
 function visibility(){if(document.hidden)flag("Browser tab or window became hidden")}
 function blur(){flag("Browser window lost focus")}
 function copy(){flag("Copy action detected")}
 function paste(){flag("Paste action detected")}
}
render();
})();