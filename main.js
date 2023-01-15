/*-------------------------------------
-Variables
-------------------------------------*/

window.iReadyFramework = { utils:{}, ui:{}, cookieUtil:{}, hook:{}, lesson:{ csidTypes:{} }, routes:{} };
window.url = window.location.href;
iReadyFramework.user = dashboardJson;

/*-------------------------------------
-Utilities
-------------------------------------*/

iReadyFramework.utils.iReadyURL = "https://login.i-ready.com/student/dashboard/home";
iReadyFramework.utils.dragElement = (e) => {var n=0,t=0,o=0,u=0;function l(e){(e=e||window.event).preventDefault(),o=e.clientX,u=e.clientY,document.onmouseup=m,document.onmousemove=d}function d(l){(l=l||window.event).preventDefault(),n=o-l.clientX,t=u-l.clientY,o=l.clientX,u=l.clientY,e.style.top=e.offsetTop-t+"px",e.style.left=e.offsetLeft-n+"px"}function m(){document.onmouseup=null,document.onmousemove=null}document.getElementById(e.id+"header")?document.getElementById(e.id+"header").onmousedown=l:e.onmousedown=l}
iReadyFramework.utils.addScript = (scriptURL) => fetch(scriptURL).then(r => r.text()).then(r => eval(r));
iReadyFramework.utils.goToDashboard = () => goto('/student/dashboard/home/');
iReadyFramework.utils.isType = value => Object.prototype.toString.call(value).slice(8, -1);
iReadyFramework.utils.delDuplicates = array => [...new Set(array)];
iReadyFramework.utils.isNull = value => value === null || value === undefined;
iReadyFramework.utils.copyToClipboard = (text) => navigator.clipboard.writeText(text);
iReadyFramework.utils.randomNumberInRange = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;
iReadyFramework.utils.toggleElementDisplay = element => element.style.display = (element.style.display === "none" ? "block" : "none");
iReadyFramework.utils.appendScript=(url)=>{ document.body.appendChild(Object.assign(document.createElement("script"), { src: url, onerror: console.error })) };

/*-------------------------------------
-UI Management
-------------------------------------*/
iReadyFramework.ui.closeModal = () => { goto('/student/dashboard/home/'), clearInterval(interval) }
iReadyFramework.ui.getModal = () => document.getElementsByClassName('css-1w7vrn4 enj526p0')[0];
iReadyFramework.ui.openTempModal = () => goto('/student/error/lockDownBrowserLoader');
iReadyFramework.ui.openModal = (title, description, callback, html) => {
    iReadyFramework.ui.openTempModal()
    let interval = setInterval(function() {
        try {
        if (iReadyFramework.ui.getModal().innerText != undefined) {
                if(html = true ) {
                    document.getElementsByClassName('css-1w7vrn4 enj526p0')[0].innerHTML = title;
                    document.getElementsByClassName('css-msv3yz enj526p0')[0].innerHTML = description;
                    document.getElementById('continue-button-button').onclick = callback;
                } else {
                    document.getElementsByClassName('css-1w7vrn4 enj526p0')[0].innerText = title;
                    document.getElementsByClassName('css-msv3yz enj526p0')[0].innerText = description;
                    document.getElementById('continue-button-button').onclick = callback;
                }
            }
        } catch (error) {}
    }, 10);
}

/*-------------------------------------
-Cookie Managment
-------------------------------------*/
iReadyFramework.cookieUtil.setCookie=(name,value,days)=>{
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
iReadyFramework.cookieUtil.getCookie =(name)=>{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/*-------------------------------------
-Hooking
-------------------------------------*/
iReadyFramework.hook.hookObj = (extractLocation, obj) => { window[extractLocation] = obj}
iReadyFramework.hook.exposeObj = (func) => { debug(func), func() }
iReadyFramework.hook.createHook=(object, functionName, hookFunction)=>{
    let temp = object[functionName]
    object[functionName] = function (...args) {
        let ret = temp.apply(this, args)
        if (ret && typeof ret.then === 'function') {
            return ret.then((value)=>{hookFunction([value, args]); return value;})
        } else {
            hookFunction([ret, args])
            return ret
        }
    }
}

/*-------------------------------------
-Lesson
-------------------------------------*/
iReadyFramework.lesson.isOpen = () => { if(window['html5Iframe'] == undefined) { return false } else { return false } };
iReadyFramework.lesson.frame = () => { return html5Iframe.contentWindow; };
iReadyFramework.lesson.env = () => { return html5Iframe.contentWindow.env; };
iReadyFramework.lesson.csid = () => { return html5Iframe.src.split('csid=')[1].split('&type')[0]; };
iReadyFramework.lesson.subject = () => { return html5Iframe.src.split('csid=')[1].split('&type')[0].split('DI.')[1].split('.')[0]; };
iReadyFramework.lesson.data = () => { return html5Iframe.contentWindow.com.cainc.ifabric.lessonReport.collectReportData(); };
iReadyFramework.lesson.part = () => { return  html5Iframe.src.split('&type=')[1].split('#')[0]; };
iReadyFramework.lesson.csidTypes.ela = {
    PhonologicalAwareness : 'DI.ELA.PA',
    Phonics : 'DI.ELA.PH',
    HighFrequencyWords : 'DI.ELA.HFW',
    Vocabulary : 'DI.ELA.VOC',
    ComprehensionLiterature : 'DI.ELA.COM.LIT',
    ComprehensionInformationalText : 'DI.ELA.COM.INFO'
}
iReadyFramework.lesson.csidTypes.math = {
    NumberAndOperations : 'DI.MATH.NO',
    AlgebraAndAlgebraicThinking : 'DI.MATH.AL',
    MeasurementAndData : 'DI.MATH.MS',
    Geometry : 'DI.MATH.GEO'
}
iReadyFramework.lesson.cheatStore = {
    getCheat: function(key) {
        iReadyFramework.lesson.frame().window.localStorage.setItem("cheats", iReadyFramework.lesson.frame().window.localStorage.getItem("cheats") ?? "{}")
        const storage = JSON.parse(iReadyFramework.lesson.frame().window.localStorage.getItem("cheats"))
        return storage[key]
    },
    setCheat: function(key, value) {
        iReadyFramework.lesson.frame().window.localStorage.setItem("cheats", iReadyFramework.lesson.frame().window.localStorage.getItem("cheats") ?? "{}")
        const storage = JSON.parse(iReadyFramework.lesson.frame().window.localStorage.getItem("cheats"))
        storage[key] = value
        iReadyFramework.lesson.frame().window.localStorage.setItem("cheats", JSON.stringify(storage))
    },
    get getAll() {
        iReadyFramework.lesson.frame().window.localStorage.setItem("cheats", iReadyFramework.lesson.frame().window.localStorage.getItem("cheats") ?? "{}")
        return JSON.parse(iReadyFramework.lesson.frame().window.localStorage.getItem("cheats"))
    },
    clear: function() {
        html5Iframe.contentWindow.localStorage.clear()
    },
    refresh: function() {
        html5Iframe.contentWindow.document.getElementById('settings-gear').click()
        html5Iframe.contentWindow.document.getElementById('cancelBtn').click()
    }
}
/*-------------------------------------
-Routes
-------------------------------------*/
iReadyFramework.routes = {
    '@@ROUTER@@/' : '/',
    '@@ROUTER@@/login' : '/login',
    '@@ROUTER@@/login/assistance' : '/login/assistance',
    '@@ROUTER@@/login/blacklistedmessage' : '/login/blacklistedmessage',
    '@@ROUTER@@/login/clever/error/:status?' : '/login/clever/error/:status?',
    '@@ROUTER@@/login/clever/error/S612' : '/login/clever/error/S612',
    '@@ROUTER@@/login/educatorIOS13GrayListed' : '/login/educatorIOS13GrayListed',
    '@@ROUTER@@/login/error/:status?' : '/login/error/:status?',
    '@@ROUTER@@/login/k1' : '/login/k1',
    '@@ROUTER@@/login/k1/class/:classCode/letter/:letter?' : '/login/k1/class/:classCode/letter/:letter?',
    '@@ROUTER@@/login/k1/class/:classCode/letter/:letter?/student/:studentId' : '/login/k1/class/:classCode/letter/:letter?/student/:studentId',
    '@@ROUTER@@/login/k1/class/:classCode/selectLetter' : '/login/k1/class/:classCode/selectLetter',
    '@@ROUTER@@/login/login_interstitial' : '/login/login_interstitial',
    '@@ROUTER@@/login/login_interstitial_main' : '/login/login_interstitial_main',
    '@@ROUTER@@/login/oneroster/error/:status?' : '/login/oneroster/error/:status?',
    '@@ROUTER@@/login/oneroster/error/S612' : '/login/oneroster/error/S612',
    '@@ROUTER@@/login/passwordexpiredmessage' : '/login/passwordexpiredmessage',
    '@@ROUTER@@/login/resetemail' : '/login/resetemail',
    '@@ROUTER@@/login/resetpassword/:token' : '/login/resetpassword/:token',
    '@@ROUTER@@/login/resetpassword/invalidtoken' : '/login/resetpassword/invalidtoken',
    '@@ROUTER@@/login/sso/error/:status?' : '/login/sso/error/:status?',
    '@@ROUTER@@/login/sso/error/S612' : '/login/sso/error/S612',
    '@@ROUTER@@/login/support' : '/login/support',
    '@@ROUTER@@/student' : '/student',
    '@@ROUTER@@/student/ActivityLaunchPage' : '/student/ActivityLaunchPage',
    '@@ROUTER@@/student/assessment/completed/:assessmentType/:score?' : '/student/assessment/completed/:assessmentType/:score?',
    '@@ROUTER@@/student/book' : '/student/book',
    '@@ROUTER@@/student/dashboard/assessment/lockdownbrowser/:subject?' : '/student/dashboard/assessment/lockdownbrowser/:subject?',
    '@@ROUTER@@/student/dashboard/home' : '/student/dashboard/home',
    '@@ROUTER@@/student/dashboard/ssolaunch/:ssotype?' : '/student/dashboard/ssolaunch/:ssotype?',
    '@@ROUTER@@/student/error/:errorReason?' : '/student/error/:errorReason?',
    '@@ROUTER@@/student/gameLauncherPage' : '/student/gameLauncherPage',
    '@@ROUTER@@/student/learningGamePlayerPage' : '/student/learningGamePlayerPage',
    '@@ROUTER@@/student/lesson/completed/:isPassingScore/:score?' : '/student/lesson/completed/:isPassingScore/:score?',
    '@@ROUTER@@/student/lesson/paused' : '/student/lesson/paused',
    '@@ROUTER@@/student/lockDownBrowserLoader' : '/student/lockDownBrowserLoader',
    '@@ROUTER@@/student/mathFluencyPlayerPage' : '/student/mathFluencyPlayerPage'
}
