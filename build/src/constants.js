
/*===============================*\
|*        __CONSTANTS__          *|
\*===============================*/
{/*Expand to see the constants*/
var CONSTANTS = {
   VERSION              : "{{ version }}",
   DEBUG_ON             : {{ debug }},
   PAGESIMILAR          : "https://jobmine.ccol.uwaterloo.ca/psc/SS/",
   PAGESIMILARTOP       : "https://jobmine.ccol.uwaterloo.ca/psp/SS/",
   EXTRA_URL_TEXT       : "__Jobmine_Plus_has_taken_over_Jobmine",
   MESSAGE_TIME_OUT     : 8,   //10 sec
   SEARCH_DAYS_CLEAR    : 30,  //30 days before ids will clear out
   STATUS_UPDATE_TIME   : 10,  //10 mins
   RESUME_DELIMITOR1    : "{|||}",
   RESUME_DELIMITOR2    : "[|||]",
   STORAGE: {
      PREV_ACTIVE_APPS_COUNT: "PREV_ACTIVE_APPS_COUNT",
      PREV_ALL_APPS_COUNT: "PREV_ALL_APPS_COUNT",
      ACTIVE_APPS_COUNT: "ACTIVE_APPS_COUNT",
      ALL_APPS_COUNT: "ALL_APPS_COUNT",
      ACTIVE_RANKING_COMPLETED_COUNT: "ACTIVE_RANKING_COMPLETED_COUNT",
      INTERVIEWS_COUNT: "INTERVIEWS_COUNT",
   },
};

var DIMENSIONS = {
   SCROLLBAR_WIDTH : 17,    //Firefox and Chrome, errors when trying to calculate it
}

var LINKS = {
   HOME        : CONSTANTS.PAGESIMILARTOP + "EMPLOYEE/WORK/h/?tab=DEFAULT",
   LOGIN       : CONSTANTS.PAGESIMILAR + "?cmd=login&languageCd=ENG",
   LOGOUT      : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/?cmd=logout",
   DOCUMENTS   : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_STU_DOCS",
   PROFILE     : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_STUDENT",
   SKILLS      : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_STUDENT?PAGE=UW_CO_STU_SKL_MTN",
   SEARCH      : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_JOBSRCH",
   LIST        : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_JOB_SLIST",
   APPLICATIONS: CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_APP_SUMMARY",
   APPLY       : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_CT_STU_APP.GBL?Action=A&UW_CO_JOB_ID=",     //UW_CO_STU_ID
   INTERVIEWS  : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_STU_INTVS",
   RANKINGS    : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_STU_RNK2",
   JOB_DESCR   : CONSTANTS.PAGESIMILAR + "EMPLOYEE/WORK/c/UW_CO_STUDENTS.UW_CO_JOBDTLS?UW_CO_JOB_ID=",
   BLANK       : "about:blank",
   EMPLYR_TOP  : "jobmine.ccol.uwaterloo.ca/psp/ES",
   EMPLYR_FRAME: "jobmine.ccol.uwaterloo.ca/psc/ES",
   UPDATE_LINK : "{{ upload_link }}",
   UPDATE_CSS  : "{{ update_css }}",
   ANDROID_APP : "{{ android_link }}",
   WORK_TERM   : null,     //Will set later
};

var NAVIGATION = {   //The order below will be on the left side
                     PROFILE        : "Profile",
                     DOCUMENTS      : "Documents",
                     SEARCH         : "Job Search",
                     LIST           : "Job Short List",
                     APPLICATIONS   : "Applications",
                     INTERVIEWS     : "Interviews",
                     RANKINGS       : "Rankings",
                  };

var COLOURS = {
   ROW_HIGHLIGHT        : "#f0f1ac",      //Light green
   HOVER                : "skyblue",
   LINK_HIGHLIGHT_HOVER : "green",
   ROW_SELECT           : "#c7e4f7",      //Lighter blue than skyblue
   GREAT                 : "#a3f57f",
   BLANK                : "white",
   BAD                  : "#f4baba",
   AVERAGE              : "#fffe93",
   WORST                : "#AAAAAA",
   GOOD                 : "#a1f6cd",
};

var OBJECTS = {
   STORAGE        :  null, //Set later
   HIGHLIGHT      :  null,
   ONPOPUPCLOSE   :  null,
   MESSAGE_TIMER  :  null,
   STATUS_TIMER   :  null,
   REFRESH_TIMER  :  null,
   UWATERLOO_ID   :  null,
};

var LARGESTRINGS = {
   POPUP : "<div id='jbmnplsPopup'><div class='wrapper'><div id='jbmnplsPopupContent' class='content draggable noselect'><div id='jbmnplsPopupTitle' class='noselect title draggable-region'></div><div id='jbmnplsPopupBody' class='body'></div><div id='jbmnplsPopupSettings' class='body'></div><div id='jbmnplsPopupFrameWrapper'><iframe id='jbmnplsPopupFrame' allowtransparency='true' frameborder='no' width='100%' height='100%' class='frame'></iframe></div><div id='jbmnplsPopupFooter' class='footer noselect'><span class='fakeLink submit' onclick='hidePopup(\"save\");' title='Click to submit.'>Submit and Close</span><span class='fakeLink save' onclick='hidePopup(\"save\");' title='Click to save.'>Save and Close</span><span title='Click to cancel.' onclick='hidePopup(\"cancel\");' class='fakeLink cancel'>Cancel</span><span onclick='hidePopup(\"close\");' class='fakeLink close' title='Click to close.'>Close</span></div></div></div>",
};

var KEYS = {
   ESCAPE   :  27,
   PERIOD   :  190,
   DASH     :  109,
};

var INPUT_RESTRICTIONS = {
   DECIMALS          : function(a){return UTIL.isNumeric(String.fromCharCode(a)) || a == KEYS.PERIOD || a == KEYS.DASH;},
   POSITIVE_DECIMALS : function(a){return UTIL.isNumeric(String.fromCharCode(a)) || a == KEYS.PERIOD;},
   INTEGERS          : function(a){return UTIL.isNumeric(String.fromCharCode(a)) || a == KEYS.DASH;},
   POSITIVE_INTEGERS : function(a){return UTIL.isNumeric(String.fromCharCode(a));},
};
}
