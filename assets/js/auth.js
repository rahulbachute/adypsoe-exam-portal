// Firebase Authentication gate for the ADYPSOE Examination Tools workspace.
// Configure assets/js/firebase-config.js before enabling this service.
// Access is granted only when the signed-in UID has an active Firestore authorisation record.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const message=document.getElementById("auth-message");
const signInButton=document.getElementById("google-signin");
const signOutButton=document.getElementById("google-signout");
const toolsState=document.getElementById("tools-auth-state");
const workspace=document.getElementById("tools-workspace");
const onLoginPage=!!signInButton;
const configReady=!!firebaseConfig && Object.values(firebaseConfig).every(v=>typeof v==="string" && v && !v.startsWith("REPLACE_"));

function showMessage(el,text){if(el)el.textContent=text;}
if(!configReady){
  showMessage(message,"Authentication is not configured yet. The Firebase project configuration and access-control rules must be completed before login can be enabled.");
  showMessage(toolsState,"Protected tools are not yet enabled. Authentication configuration and backend verification are required.");
}else{
  const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),provider=new GoogleAuthProvider();
  provider.setCustomParameters({prompt:"select_account"});
  async function authorise(user){
    if(!user.emailVerified)throw new Error("Your Google account email must be verified.");
    const snap=await getDoc(doc(db,"authorisedUsers",user.uid));
    if(!snap.exists())throw new Error("Your account is authenticated but has not been authorised by the Examination Section Administrator.");
    const access=snap.data();
    if(access.active!==true)throw new Error("Your examination-tools access is currently disabled. Contact the Administrator.");
    return access;
  }
  if(signInButton)signInButton.disabled=false;
  signInButton?.addEventListener("click",async()=>{
    signInButton.disabled=true;showMessage(message,"Signing in…");
    try{const result=await signInWithPopup(auth,provider);await authorise(result.user);location.href="tools.html";}
    catch(error){showMessage(message,error.message||"Sign-in could not be completed.");signInButton.disabled=false;}
  });
  signOutButton?.addEventListener("click",()=>signOut(auth).then(()=>location.reload()));
  document.getElementById("tools-signout")?.addEventListener("click",()=>signOut(auth).then(()=>location.href="login.html"));
  onAuthStateChanged(auth,async user=>{
    if(!user){if(!onLoginPage)location.replace("login.html");else showMessage(message,"Please sign in with an authorised Google account.");return;}
    if(onLoginPage){try{await authorise(user);location.replace("tools.html");}catch(e){showMessage(message,e.message);signOutButton.hidden=false;}return;}
    try{
      const access=await authorise(user);
      const name=document.getElementById("tools-user-name"),email=document.getElementById("tools-user-email");
      if(name)name.textContent="Welcome"+(access.displayName?" "+access.displayName:"");
      if(email)email.textContent=user.email||"";
      const registerCard=document.getElementById("register-tool-card");
      const permissions=Array.isArray(access.allowedTools)?access.allowedTools:[];
      if(registerCard && !permissions.includes("question-paper-register") && !permissions.includes("*") && access.role !== "super_admin") registerCard.hidden=true;
      if(workspace)workspace.hidden=false;
      if(toolsState)toolsState.hidden=true;
    }catch(e){showMessage(toolsState,e.message);await signOut(auth);}
  });
}
