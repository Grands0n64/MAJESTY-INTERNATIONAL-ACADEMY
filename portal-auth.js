(()=>{"use strict";
const $=id=>document.getElementById(id);
const status=$("auth-status"),signin=$("auth-signin"),signup=$("auth-signup"),signout=$("auth-signout"),google=$("auth-google"),toggle=$("auth-toggle");
let client=null,session=null,mode="signin",busy=false;
const say=m=>{if(status)status.textContent=m};
function setMode(next){
 mode=next;const creating=mode==="signup";
 $("auth-name").classList.toggle("hidden",!creating);
 $("auth-level").classList.toggle("hidden",!creating);
 signin.classList.toggle("hidden",creating);
 signup.classList.toggle("hidden",!creating);
 $("auth-mode-label").textContent=creating?"Create your student account below.":"Welcome back. Sign in with your registered email and password.";
 toggle.textContent=creating?"Already have an account? Sign in":"New student? Create an account";
 $("auth-password").autocomplete=creating?"new-password":"current-password";
}
function showSession(s){
 session=s;const active=!!s;
 $("auth-email").classList.toggle("hidden",active);
 $("auth-password").classList.toggle("hidden",active);
 $("auth-name").classList.add("hidden");$("auth-level").classList.add("hidden");
 signin.classList.add("hidden");signup.classList.add("hidden");
 toggle.classList.toggle("hidden",active);
 google.classList.toggle("hidden",active);
 signout.classList.toggle("hidden",!active);
 if(active){
  $("auth-mode-label").textContent="You are signed in to your Majesty student account.";
  $("student-label").textContent=(s.user.email||"Student")+" · secure account";
  $("profile-name").textContent=s.user.user_metadata?.full_name||"Student";
  say("Signed in as "+(s.user.email||"student")+". Checking your student profile…");
  loadProfile(s).catch(e=>say("Signed in, but profile could not load: "+e.message));
 }else{
  $("student-label").textContent="Student workspace";
  $("auth-mode-label").textContent="Welcome back. Sign in with your registered email and password.";
  setMode(mode);
  say("You are signed out. Enter your registered email and password to sign in.");
 }
}
async function loadProfile(s){
 const {data,error}=await client.from("profiles").select("full_name,level").eq("id",s.user.id).maybeSingle();
 if(error)throw error;
 if(data){
  $("student-name").value=data.full_name||"";
  $("level").value=data.level||"";
  $("profile-name").textContent=data.full_name||s.user.user_metadata?.full_name||"Student";
  $("profile-level").textContent=data.level||"Choose your level";
  $("auth-name").value=data.full_name||"";
  if(data.level)$("auth-level").value=data.level;
 }else{
  const meta=s.user.user_metadata||{};
  const profile={id:s.user.id,full_name:meta.full_name||"",level:meta.level||null};
  const {error:insertError}=await client.from("profiles").upsert(profile,{onConflict:"id"});
  if(insertError)throw insertError;
  $("student-name").value=profile.full_name;
  $("profile-name").textContent=profile.full_name||"Student";
  if(profile.level){$("level").value=profile.level;$("profile-level").textContent=profile.level;}
 }
 window.dispatchEvent(new Event("majesty-auth-ready"));
 say("Your student account is signed in and your profile is loaded.");
}
async function run(button,fn){
 if(busy)return;busy=true;button.disabled=true;
 try{await fn()}catch(e){say(e?.message||"Something went wrong. Please try again.")}finally{button.disabled=false;busy=false}
}
toggle.addEventListener("click",()=>setMode(mode==="signin"?"signup":"signin"));
signin.addEventListener("click",()=>run(signin,async()=>{
 const email=$("auth-email").value.trim(),password=$("auth-password").value;
 if(!email||!password){say("Enter your email address and password.");return}
 say("Signing in…");
 const {data,error}=await client.auth.signInWithPassword({email,password});
 if(error)throw error;
 if(!data.session)throw new Error("No sign-in session was returned. Confirm your email address and try again.");
 showSession(data.session);
}));
signup.addEventListener("click",()=>run(signup,async()=>{
 const full_name=$("auth-name").value.trim(),email=$("auth-email").value.trim(),password=$("auth-password").value,level=$("auth-level").value;
 if(!full_name||!email||!level||password.length<8){say("Enter your full name, email, learning level and a password of at least 8 characters.");return}
 say("Creating your account…");
 const {data,error}=await client.auth.signUp({email,password,options:{data:{full_name,level}}});
 if(error)throw error;
 if(data.session)showSession(data.session);
 else{setMode("signin");$("auth-email").value=email;say("Account created. Check your email for the confirmation link. Confirm it, then sign in here using the same email and password.");}
}));
signout.addEventListener("click",()=>run(signout,async()=>{
 const {error}=await client.auth.signOut();if(error)throw error;
 showSession(null);say("You have signed out. You can now sign in or create another account.");
}));
google.addEventListener("click",()=>run(google,async()=>{
 say("Connecting to Google…");
 const {error}=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+window.location.pathname}});
 if(error)throw error;
}));
$("save-profile").addEventListener("click",async()=>{
 if(!client||!session){say("Sign in before saving your student profile.");return}
 const full_name=$("student-name").value.trim(),level=$("level").value;
 if(!full_name||!level){say("Enter your name and choose your learning level.");return}
 const {error}=await client.from("profiles").upsert({id:session.user.id,full_name,level,updated_at:new Date().toISOString()},{onConflict:"id"});
 if(error){say("Profile could not be saved: "+error.message);return}
 $("profile-name").textContent=full_name;$("profile-level").textContent=level;
 say("Student profile saved securely to Majesty Academy.");
});
function init(){
 if(!window.supabase){say("Supabase sign-in library did not load. Check your internet connection and refresh.");return}
 const url=window.MAJESTY_SUPABASE_URL,key=window.MAJESTY_SUPABASE_ANON_KEY;
 if(!url||!key){say("Supabase is not configured. Check supabase-config.js.");return}
 client=window.supabase.createClient(url,key);
 client.auth.onAuthStateChange((_event,s)=>showSession(s));
 client.auth.getSession().then(({data,error})=>{if(error)throw error;showSession(data.session||null)}).catch(e=>say("Could not check your sign-in session: "+e.message));
}
init();
window.MAJESTY_AUTH={get client(){return client},get session(){return session}};
})();