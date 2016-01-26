/*================================*\
|*     __INDIVIDUAL_PAGES__       *|
\*================================*/
//See if we are at home page
OBJECTS.UWATERLOO_ID = $('#UW_CO_STUDENT_UW_CO_STU_ID').plainText();
switch (PAGEINFO.TYPE) {
    case PAGES.HOME:
        { /*Expand to see what happens when you reach home page*/
            if (!PAGEINFO.IN_IFRAME) {
                { //Clean up code
                    BRIDGE.addJS(function() {
                        pthNav.abn.init = function() {};
                        ptEvent.add2 = ptEvent.add;
                        ptEvent.add = function(a, b, c) {
                            if (a != null) {
                                ptEvent.add2(a, b, c);
                            }
                        };
                    });
                    //Cancel the load for the item
                    $(document.body).removeAttr('onload');
                    //Delete the useless stuff on home page
                    $('body > table').remove();
                }

                /**
                 *    Handle what page to go to
                 */
                var gotoLocation = window.location.hash == '' ? '' : window.location.hash.substr(1); //Get rid of # in hash
                window.location.hash = CONSTANTS.EXTRA_URL_TEXT;

                var currentPage = gotoLocation;
                if (CONSTANTS.EXTRA_URL_TEXT == currentPage) { //Refreshed the entire page
                    currentPage = PREF.load('LAST_PAGE');
                } else if (currentPage == null || !PAGES.isValid(currentPage) || !NAVIGATION.hasOwnProperty(currentPage)) {
                    currentPage = PREF.load('SETTINGS_GENERAL_DEFAULT_PAGE', null, PAGES.APPLICATIONS);
                }
                var link = LINKS[currentPage.toUpperCase()];

                /**
                 *    Set some stuff in the nav to match the new location
                 */
                addHeader();
                setTitle(NAVIGATION[currentPage]);
                setNavSelection($("#jbmnplsNav a[type='" + currentPage + "']").attr('item'));

                //Appends the iframe that holds the content
                $('body').append("<div id='jbmnplsFrameWrapper'><iframe style='position:relative;visibility:hidden;' src='" + link + "' frameborder='0' id='jbmnplsWebpage' width='100%' height='100%'/></div><div id='pthnavcontainer' class='hide'></div>");

                //Hacked the navigation because we have an iframe
                $('#jbmnplsNav a').click(function(e) {
                    var obj = e.target;
                    if (obj.getAttribute('target') == '_blank') {
                        return;
                    }
                    e.preventDefault();
                    var newLocation = obj.getAttribute('realHref');
                    var index = obj.getAttribute('item');
                    var newTitle = obj.innerHTML;
                    changeLocation(newLocation, newTitle, index);
                });

                //If debug is on, we can add the debugger window
                if (CONSTANTS.DEBUG_ON) {
                    DEBUGGER.init();
                }
                initDraggable();
                invokeRefreshTimer();
                //Frames to give the illusion that Jobmine Plus loads right away
                function hideFrame() {
                    $('#jbmnplsWebpage').css('visibility', 'hidden');
                }

                function showFrame() {
                    setTimeout(function() { //Must come after Firefox trashes last iframe data before loading next url
                        $('#jbmnplsWebpage').css('visibility', 'visible');
                    }, 1);
                }
                BRIDGE.registerFunction('hideFrame', hideFrame);
                BRIDGE.registerFunction('showFrame', showFrame);
            } else {
                //Cannot have itself in its own iframe
                return;
            }
            initStatusBar();
        }
        break;
    case PAGES.LOGIN:
        { /*Expand to see what happens when you reach login page*/
            //To avoid hanging if you have been kicked off
            if (PAGEINFO.IN_IFRAME) {
                top.location.href = LINKS.LOGIN;
                return;
            }

            function setAutoComplete(flag) {
                if (flag) {
                    $("#userid").attr("autocomplete", "on").attr("value", defaultUser.toLowerCase());
                    $("#pwd, #login").attr("autocomplete", "on");
                } else {
                    $("#pwd, #login, #userid").attr("autocomplete", "off");
                }
            }
            var checked = false;
            var cookieName = "RememberLogin";
            var rememberMe = Cookies.read(cookieName);
            if (rememberMe != -1 && rememberMe == "1") {
                //Determine the person
                var defaultUser = Cookies.read("SignOnDefault");
                if (defaultUser != -1) {
                    setAutoComplete(true);
                    $("body").attr("onload", "");
                    BRIDGE.run(function() {
                        document.getElementById("userid").focus();
                        document.getElementById("pwd").focus();
                    });
                    checked = true;
                }
            }
            //Put the extra field in
            var insertLoc = $("#login table:eq(0)");
            var message = "Save My Username<br/><span class='important'>(DO NOT CHECK ON PUBLIC PC)</span>";
            if (PAGEINFO.BROWSER == BROWSER.FIREFOX) {
                message = "Remember Me<br/><span class='important'>(DO NOT CHECK ON PUBLIC PC)</span>";
            }
            insertLoc.after("<div id='jbmnplsHolder' class='noselect'><input id='jbmplsChbx' class='checkbox' " + (checked ? "checked='true'" : "") + " type='checkbox'/><label class='message' for='jbmplsChbx'>" + message + "</label></div>");
            $("#jbmplsChbx").change(function() {
                if (this.checked) {
                    Cookies.set(cookieName, "1");
                } else {
                    Cookies.remove(cookieName);
                }
                setAutoComplete(this.checked);
            });
            PREF.remove("LAST_PAGE");
        }
        break;
    case PAGES.DETAILS:
        { /*Expand to see what happens when you reach job details page*/
            if (!PAGEINFO.IN_IFRAME) { //Ported from Jobmine Plus version 1
                initDraggable();
                var form = $("body form:eq(0)");
                if (PREF.load("SETTINGS_PAGES_SHOW_OLD", null, false) === false) {
                    //Data that needs to be extracted from the page, this object holds it all
                    var jobDescriptionData = {
                        employerName: "",
                        position: "",
                        location: "",
                        openings: "",
                        jobLevels: "",
                        grades: "",
                        comments: "",
                        description: "",
                        openDate: "",
                        cecsCoord: "",
                        disciplines: "",
                        closeDate: "",
                        wtSupport: ""
                    };
                    $("#ACE_width span").each(function(index) {
                        var text = $(this).plainText();
                        if (text != "") {
                            switch (index) {
                                case 3:
                                    jobDescriptionData.openDate = text;
                                    break;
                                case 4:
                                    jobDescriptionData.closeDate = text;
                                    break;
                                case 10:
                                    jobDescriptionData.employerName = text;
                                    break;
                                case 12:
                                    jobDescriptionData.position = text;
                                    break;
                                case 14:
                                    jobDescriptionData.grades = text;
                                    break;
                                case 16:
                                    jobDescriptionData.location = text;
                                    break;
                                case 18:
                                    jobDescriptionData.openings = text;
                                    break;
                                case 20:
                                    jobDescriptionData.disciplines = text + ", ";
                                    break;
                                case 21:
                                    jobDescriptionData.disciplines += text;
                                    break;
                                case 23:
                                    jobDescriptionData.jobLevels = text;
                                    break;
                                case 27:
                                    jobDescriptionData.wtSupport = text;
                                    break;
                                case 26:
                                    jobDescriptionData.cecsCoord = text;
                                    break;
                                case 29:
                                    jobDescriptionData.comments = text;
                                    break;
                                case 31:
                                    jobDescriptionData.description = $(this).html();
                                    break;
                            }
                        }
                    });
                    setTitle("Job Details: " + jobDescriptionData.employerName);
                    //Add url a-href to most of the links on page
                    jobDescriptionData.description = jobDescriptionData.description.replace(/((http:|https:|www.)[^\s]+)/gi, function(item) {
                        item = item.replace(/&nbsp;/, ""); //usually this appears at the end of the link
                        //Removes random all punctuation at the end of the link
                        var endPunctuation = "";
                        item = item.replace(/([^\/\w])+$/, function(characters) {
                            endPunctuation = characters;
                            return "";
                        });
                        item = item.toUpperCase().indexOf('HTTP') == 0 ? item : "http://" + item;
                        return "<a href='" + item + "' target='_blank'>" + item + "</a>" + (endPunctuation ? endPunctuation : "");
                    });
                    var toolbar = "<div id='toolbar' class='printHide'>Don't like this look for your job descriptions? <span id='showOldDetailsBtn' class='fakeLink' href='#'>Click here to change it back</span></div>";
                    var newBody = "<table class='page' id='jobDetails' cellspacing='0' cellpadding='0'><tr><td valign='top' id='header'><span class='title'>Employer: <a class='printHide' target='_blank' title='Google search " + jobDescriptionData.employerName + "' href='http://www.google.ca/#hl=en&q=" + encodeURIComponent(jobDescriptionData.employerName) + "'>" + (jobDescriptionData.employerName.length > 48 ? jobDescriptionData.employerName.substring(0, 48) + "..." : jobDescriptionData.employerName) + "</a><a class='printshow' href='#'>" + jobDescriptionData.employerName + "</a></span><input class='button printHide' onclick='window.print();' type='button' value='Print Job Description'/><br/><br/><table class='jobDescriptionArea' cellspacing='0' cellpadding='0'><tr><td valign='top' class='left category'>Job Title:</td><td valign='top' class='left description'>" + jobDescriptionData.position + "</td><td valign='top' class='category right'>Levels:</td><td valign='top' class='right description'>" + jobDescriptionData.jobLevels + "</td></tr><tr><td valign='top' class='left category'>Work Location:</td><td valign='top' class='left description'><a target='_blank' href='http://maps.google.ca/maps?hl=en&q=" + encodeURIComponent(jobDescriptionData.employerName) + "+" + encodeURIComponent(jobDescriptionData.location) + "' title='Search location' class='location'>" + jobDescriptionData.location + "</a></td><td valign='top' class='category right'>Grades:</td><td valign='top' class='right description'>" + jobDescriptionData.grades + "</td></tr><tr><td valign='top' class='left category'>Available Openings:</td><td valign='top' class='left description'>" + jobDescriptionData.openings + "</td><td valign='top' class='category right'></td><td valign='top' class='right description'></td></tr></table><input class='button printHide' onclick='invokeEmployerPopup();' type='button' value='View Employer Profile'/><br/><br/>" + (jobDescriptionData.comments == "" ? "" : "<table id='comments' cellspacing='0' cellpadding='0'><tr><td class='category' valign='top'>Comments:</td><td class='important' valign='top'>" + jobDescriptionData.comments + "</td></tr></table>") + "<hr/></td></tr><tr><td valign='top' id='content'><div class='title'>Description</div><div class='body'>" + jobDescriptionData.description + "</div></td></tr><tr><td valign='top' id='footer'><hr/><table class='jobDescriptionArea' cellspacing='0' cellpadding='0'><tr><td valign='top' class='left'><table cellspacing='0' cellpadding='0'><tr><td valign='top' class='category'>Posting Open Date:</td><td valign='top'>" + jobDescriptionData.openDate + "</td></tr><tr><td valign='top' class='category'>CECS Field Co-ordinator:</td><td valign='top'>" + jobDescriptionData.cecsCoord + "</td></tr><tr><td valign='top' class='category'>Work Term Support:</td><td valign='top'>" + jobDescriptionData.wtSupport + "</td></tr><tr><td colspan='2'><br/><table class='jobDescriptionArea' cellspacing='0' cellpadding='0'><tr><td valign='top' class='category'>Disciplines:</td><td valign='top' class='left' style='white-space:normal;'>" + jobDescriptionData.disciplines + "</td></tr></table></td></tr></table></td><td valign='top' class='right'><table cellspacing='0' cellpadding='0'><tr><td valign='top' class='category'>Last Day to Apply:</td><td valign='top'>" + jobDescriptionData.closeDate + "</td></tr></table></td></tr></table><hr class='printHide'/></td></tr></table>";
                    var detailsCss = {
                        "body.PSPAGE": {
                            "overflow-y": "scroll",
                            "padding": "0 50px",
                        },
                        "html,body": {
                            "height": "auto !important",
                        },
                        ".printshow": {
                            "display": "none",
                        },
                        "iframe": {
                            "overflow-x": "hidden",
                            "overflow-y": "scroll",
                        },
                        ".jobmineButton": {
                            "font-family": " 'Arial','sans-serif'",
                            "font-size": " 9pt",
                            "font-weight": " normal",
                            "font-Style": " normal",
                            "font-variant": " normal",
                            "color": " rgb(0,0,0)",
                            "background-color": " rgb(255,255,153)",
                        },
                        "#jobDetails.page": {
                            "width": "760px",
                            "height": "950px",
                            "min-height": "950px",
                            "margin": " 50px auto",
                            "-moz-box-shadow": " 0 0 1em black",
                            "-webkit-box-shadow": " 0 0 1em black",
                            "box-shadow": " 0 0 1em black",
                            "background-color": " #f6f6f6",
                            "padding": " 35px 20px",
                            "font-family": " Arial, Verdana, san-serif",
                            "font-size": "12px",
                        },
                        "input.button": {
                            "float": "right",
                        },
                        ".important": {
                            "color": "red",
                        },
                        ".jobDescriptionArea td, #comments td": {
                            "font-size": "14px",
                        },
                        ".jobDescriptionArea .left": {
                            "width": "100%",
                        },
                        "#header .jobDescriptionArea td, #footer .jobDescriptionArea td": {
                            "white-space": "nowrap",
                        },
                        ".jobDescriptionArea a.location": {
                            "color": " #3333cc",
                            "text-decoration": " none",
                        },
                        ".jobDescriptionArea .category": {
                            "font-weight": "bold",
                            "padding-right": "10px",
                            "width": "10px",
                        },
                        "#comments": {
                            "margin-top": "10px",
                            "display": jobDescriptionData.comments == " " ? "none" : "block",
                        },
                        "#comments .category": {
                            "font-weight": "bold",
                            "padding-right": "30px",
                        },
                        "hr": {
                            "color": "#6c6cbd",
                            "margin": "10px 0",
                        },
                        "#content .body": {
                            "margin": " 15px 0px",
                        },
                        ".title": {
                            "font-size": "19px",
                            "color": " #4b4bb4 !important",
                            "font-weight": " bold",
                        },
                        "#jobDetails .title a:visited": {
                            "font-size": "19px",
                            "color": " #4b4bb4 !important",
                        },
                        "#jobDetails .title a": {
                            "font-weight": " normal",
                            "margin-left": "10px",
                        },
                        "#content": {
                            "height": "100%",
                        },
                        "#footer": {
                            "max-height": "110px",
                        },
                        /*Toolbar*/
                        "#toolbar": {
                            "background-color": "rgba(0,0,0,0.6)",
                            "color": "white",
                            "width": "100%",
                            "position": "fixed",
                            "text-align": "center",
                            "top": "0",
                            "left": "0",
                            "padding": "5px 20px",
                            "font-family": "Arial",
                            "font-size": "12px",
                        },
                        "#toolbar span.fakeLink": {
                            "color": " white",
                            "text-decoration": "underline",
                        },
                        "#toolbar span.fakeLink:hover": {
                            "color": " #CCC",
                        },
                    };
                    var printCSS = "<style>@media print{#jbmnplsPopup{display:none !important;}body.PSPAGE.JOB_DETAILS{margin:0;padding:0;}a{color: black !important;text-decoration: none;}hr{color:black;}.printHide{display:none !important;}#jobDetails .title{color: black !important;}body, #jobDetails.page{width: 100%;padding:0px;margin:0px;-moz-box-shadow: none;-webkit-box-shadow: none;background-color:white;}.printshow{display:inline !important;}}</style>";
                    //Clean up the page
                    form.children("div").remove();
                    form.append(newBody).append(toolbar);
                    appendCSS(detailsCss);
                    $("body").append(printCSS);

                    $("#showOldDetailsBtn").click(function() {
                        PREF.save("SETTINGS_PAGES_SHOW_OLD", true);
                        refresh();
                    });

                    BRIDGE.registerFunction("invokeEmployerPopup", function() {
                        showPopup(true, null, "Employer Profile", 550, null, null, PAGEINFO.URL + "&jbmnpls=employeeInfo");
                        $("#jbmnplsPopupFrame").css("visibility", "hidden").unbind().bind("load", function() {
                            var obj = $(this);
                            if (obj.contents().find("#win0divUW_CO_JOBDTL_VW_UW_CO_PROFILE").exists()) {
                                obj.css("visibility", "visible");
                            }
                        });
                    });

                } else { //Old webpage
                    var toolbar = "<div id='toolbar' class='printHide'>Want to see the Jobmine Plus version of job descriptions? <span class='fakeLink' id='showNewDetailsBtn'>Click here to change it</span></div>";
                    var cssStyles = "<style>body.PSPAGE{margin-top:30px;}@media print{.PSPAGE{margin-top:1px;}.printHide{display:none;}}/*Toolbar*/#toolbar{background-color: rgba(0,0,0,0.6);color: white;width:100%;position:fixed;text-align:center;top:0;left:0;padding: 5px 20px;font-family:Arial;font-size:12px;}#toolbar span.fakeLink{color: white;text-decoration:underline;}#toolbar span.fakeLink:hover{color: #CCC;}</style>";
                    form.append(toolbar).append(cssStyles);

                    //Clicking the link would tell it to look at the old one
                    $("#showNewDetailsBtn").click(function() {
                        PREF.save("SETTINGS_PAGES_SHOW_OLD", false);
                        refresh();
                    });
                }
            } else if (PAGEINFO.URL.contains("&jbmnpls=employeeInfo")) { //In iframe being loaded for finding employee info
                BRIDGE.run(function() {
                    submitAction_win0(document.win0, '#ICPanel1');
                });
            }
            if (PREF.load("SETTINGS_GENERAL_KILL_TIMER", null, false)) {
                invokeUpdateStatusBarUpdate(LINKS.RANKINGS);
            }
        }
        break;
    case PAGES.EMPLOYEE_PROF:
        {
            if (PAGEINFO.IN_IFRAME) {
                //Clean up
                $("body form:eq(0)").children("div:not('#PAGECONTAINER')").remove();
                $("#PAGECONTAINER").css({
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                });
                var trs = $("#ACE_width tr");
                trs.eq(-1).find("td:eq(0)").removeAttr("height");
                trs.eq(1).remove();
                trs.eq(2).remove();
            }
        }
        break;
    case PAGES.APPLY:
        { /*Expand to see what happens when you apply*/
            // Fixes the issue where this runs on Job Search Resume upload
            if (window.parent == window.top) {
                return;
            }
            initAjaxCapture();
            var viewLink = $('#UW_CO_PDF_LINKS_UW_CO_DOC_VIEW').attr('href'),
                message = $('#UW_CO_APPDOCWRK_UW_CO_ALL_TEXT').val(),
                $dropdown = $("#UW_CO_APPDOCWRK_UW_CO_DOC_NUM"),
                hideView = true;

            // Crazy if statement to decide messages and errors if user did something wrong or right
            var resumes = PREF.load("RESUMES").split(CONSTANTS.RESUME_DELIMITOR2),
                resumeName = "Loading...";
            if (message.contains("Upload cancelled.") || message.contains("Your document was not uploaded as it is not a PDF file.") || message.contains("You must select a PDF document to upload.")) {
                // Once we cancel the upload, fix everything up
                var index = $("#UW_CO_APPDOCWRK_UW_CO_DOC_NUM").val();
                if (index != "") {
                    index = parseInt(index) - 1;
                    var isViewAble = !resumes.empty() && resumes[index].charAt(resumes[index].length - 1) == "1";
                    if (isViewAble) {
                        resumeName = resumes[index].split(CONSTANTS.RESUME_DELIMITOR1)[0];
                        hideView = false;
                    }
                }
                if (message.contains("You must select a PDF document to upload.") || message.contains("Your document was not uploaded as it is not a PDF file.")) {
                    showMessage("Upload a valid PDF document.");
                }
            } else if (message.contains('Your PDF document has been successfully')) {
                resumeName = "[Uploaded Resume]";
                hideView = false;
            }

            // Append the rest of the interface
            $(document.body).append("<span id='or-text'>OR</span>").append(
                '<span id="resume-holder">\
            <span id="resume-name">' + resumeName + '</span> \
            <a id="view-resume" onclick="showMessage(\'Retrieving resume, please wait.\')" href="' + viewLink + '">(View)</a>\
          </span>');
            if (hideView) {
                $('#view-resume').hide();
            }

            // Show the first resume if it is viewable
            var firstResumeViewable = !resumes.empty() && resumes[0].charAt(resumes[0].length - 1) == "1";
            if (message == "" && firstResumeViewable) {
                $dropdown.val(1);
                BRIDGE.run(function() { // for Chrome <3
                    var obj = document.getElementById('UW_CO_APPDOCWRK_UW_CO_DOC_NUM');
                    addchg_win0(obj);
                    submitAction_win0(obj.form, obj.name);
                });
            } else if (resumeName == "Loading..." || !firstResumeViewable) {
                $("#resume-name").html("<span style='color:red'>Please select/upload a resume.</span>");
            }

            // Add the names of the resumes to the dropdown
            fixApplyInterface();

            // Apply CSS
            var cssObj = {
                'body, html': {
                    'overflow': 'hidden !important',
                },
                'body > form': {
                    'position': 'fixed',
                    'top': '-4000px',
                },
                '#UW_CO_APPDOCWRK_UW_CO_DOC_NUM_LBL,\
          #UW_CO_APPDOCWRK_UW_CO_DOC_NUM,\
          #UW_CO_JOBDTL_VW_UW_CO_PARENT_NAME,\
          #UW_CO_JOBDTL_VW_UW_CO_JOB_TITLE,\
          #win0divlblUW_CO_APPS_UW_CO_APPL_MARKS,\
          #UW_CO_APPS_UW_CO_APPL_MARKS,\
          #or-text,\
          #resume-holder,\
          #win0divUW_CO_APPWRK_UW_CO_ATTACHADD': {
                    'position': 'fixed',
                    'top': '15px',
                    'left': '20px',
                    'font-size': '14px',
                },
                '#UW_CO_JOBDTL_VW_UW_CO_PARENT_NAME': { // Employer
                    'font-size': '20px',
                    'font-weight': 'bold',
                },
                '#UW_CO_JOBDTL_VW_UW_CO_JOB_TITLE': { // Job title
                    'top': '40px',
                },
                '#UW_CO_APPDOCWRK_UW_CO_DOC_NUM_LBL': { // Resume label
                    'top': '105px',
                },
                '#UW_CO_APPDOCWRK_UW_CO_DOC_NUM': { // Resume Dropdown
                    'top': '135px',
                    'left': '110px',
                    'width': '108px !important',
                    'height': '21px',
                },
                '#win0divUW_CO_APPWRK_UW_CO_ATTACHADD': { // Resume Upload Button
                    'top': '135px',
                    'left': '280px',
                },
                '#win0divlblUW_CO_APPS_UW_CO_APPL_MARKS': { // Include grades label
                    'top': '80px',
                },
                '#UW_CO_APPS_UW_CO_APPL_MARKS': { // Include grades dropdown
                    'top': '78px',
                    'left': '130px',
                },
                '#resume-holder *': {
                    'font-size': '14px',
                },
                '#resume-holder': {
                    'top': '105px',
                    'left': '85px',
                },
                '#or-text': {
                    'top': '137px',
                    'left': '238px',
                    'color': '#444',
                },
            };
            var $dropdown = $("#UW_CO_APPS_UW_CO_APPL_MARKS");
            var showGrades = !$dropdown.attr('disabled');
            if (!showGrades) {
                cssObj["#win0divUW_CO_APPS_UW_CO_APPL_MARKS, #win0divlblUW_CO_APPS_UW_CO_APPL_MARKS"] = {
                    display: "none"
                };
            }
            appendCSS(cssObj);
        }
        break;
    default:
        { /*Expand to see what this section*/
            //Redirect to home page if necessary the top is not already at home
            if (!PAGEINFO.IN_IFRAME) {
                redirect(LINKS.HOME);
                return;
            }

            var form = $("form:eq(0)");
            //Apply the header for the page if it exists
            if (PAGEINFO.TYPE) {
                $("body").prepend("<div class='pageTitle noselect'>" + PAGEINFO.TYPE.replace(/_/g, " ") + "</div>");
            }
            initAjaxCapture();
            initRowDeletion();
            initDraggable();

            //Update stuff
            addUpdateMessage();
            $("head").append("<link href='" + LINKS.UPDATE_CSS + "' type='text/css' rel='stylesheet'/>");

            //Append an iframe for whatever reasons needed for it
            $("body").append("<iframe id='slave' style='display:none;visibility:hidden;' width='0'height='0' src='about:blank'></iframe>");

            //Record last page visited
            if (PAGEINFO.TYPE != null) {
                var pageKey = REVERSE_PAGES[PAGEINFO.TYPE];
                if (NAVIGATION.hasOwnProperty(pageKey)) {
                    PREF.save("LAST_PAGE", pageKey);
                }
            }
            //Iframe is done
            $(window).unload(function() {
                if (PAGEINFO.TYPE != null) {
                    var pageKey = REVERSE_PAGES[PAGEINFO.TYPE];
                    if (NAVIGATION.hasOwnProperty(pageKey)) {
                        PREF.save("LAST_PAGE", pageKey);
                    }
                }
                BRIDGE.addJS(function() {
                    if (window.parent.hideFrame) {
                        window.parent.hideFrame();
                    }
                });
            });

            //Welcome message - only shown once!
            if (PREF.load("SHOW_WELCOME_MSG")) {
                showPopup(true, "<h1>Welcome to Jobmine Plus!</h1><br/>Before you get started please know that I save all your preferences to localStorage. If you do not know what that means, that means that all your saved settings will only apply to <span class='bold'>this computer</span> and <span class='bold'>this browser</span>.<br/><br/><h2>Important</h2><span style='color:red;'>The 'customize' button on each table requires that you un-hide any columns in the original Jobmine or else some features will work on Jobmine Plus.</span><br/><span class='detail'>(If you do know know what I mean, <a href='mailto:{{ email }}'>I can explain via email</a>)</span><br/><br/>Therefore please disable Jobmine Plus and go back to Jobmine to un-hide all custom headers if you have done so.<br/><br/>That is it, so please enjoy using Jobmine Plus 2.0!<br/><br/><br/><br/>",
                    "Welcome!", //Title
                    400, //Width
                    null, //No max height
                    function() { //Callback
                        PREF.save("SHOW_WELCOME_MSG", false); //Clicking close will never let you see the message again
                    });
            }
        }

        //Parse Individual pages here
        switch (PAGEINFO.TYPE) {
            case PAGES.SEARCH:
                { /*Expand to see what happens when you reach the search page*/
                    attachNewSearchFields();
                    $("#PAGEBAR").remove();

                    function markRead(rowNum, id) {
                        var row = $("#row_Results_" + rowNum);
                        Assert(row.exists(), "Read status is broken, row " + rowNum + " does not exist.");
                        var rowData = row.children();
                        rowData.eq(0).text("Read");
                        SearchManager.setRead(id);
                        table0.updateTable();
                    }

                    function onShortList(rowNum, shortListIndex) {
                        var row = $("#row_Results_" + rowNum);
                        Assert(row.exists(), "Read status is broken, row " + rowNum + " does not exist.");
                        var rowData = row.children();
                        rowData.eq(shortListIndex).find(":first").addClass("loading").removeAttr("onclick").text("");
                        $("#jbmnplsResults").addClass("disable-links"); // Disables the table so that it waits to finish shortlisting
                    }
                    BRIDGE.registerFunction("markRead", markRead);
                    BRIDGE.registerFunction("onShortList", onShortList);
                    SearchManager.updateLastVisit();
                    var table0 = makeTable("Results", "UW_CO_JOBRES_VW$scroll$0");
                    if (table0.columns > 8) {
                        table0.insertColumn("Hiring Chances", 8, function(row, rowData, reverseLookup) {
                            if (!reverseLookup.hasOwnProperty("Openings") || !reverseLookup.hasOwnProperty("# Apps")) {
                                return MESSAGE.UNHIDE_COLUMNS;
                            }
                            var openings = rowData[reverseLookup["Openings"]];
                            var applications = rowData[reverseLookup["# Apps"]];
                            if (openings.empty() && applications.empty()) {
                                return "";
                            }
                            openings = openings.empty() ? 0 : parseInt(openings);
                            applications = applications.empty() ? 1 : parseInt(applications) + 1;
                            var percentage = Math.round(openings / applications * 1000) / 10;
                            var value = (percentage >= 100 ? 99.9 : percentage) + "%";
                            return "<span title='Hiring Changes is just Openings/(Applications+1), meaning after you apply this is the percentage. NOT ACCURATE because it does not calculate your skill level'>" + value + "</span>";
                        })
                    } else {
                        showMessage(MESSAGE.UNHIDE_COLUMNS_PAGE, 12);
                    }
                    table0.applyFilter("Employer Name", TABLEFILTERS.googleSearch)
                        .applyFilter("Location", TABLEFILTERS.googleMap)
                        .insertColumn("Read Status", 0, function(row, rowData, reverseLookup) {
                            if (!reverseLookup.hasOwnProperty("Job Identifier")) {
                                return "Missing ID Column";
                            }
                            var id = rowData[reverseLookup["Job Identifier"]];
                            if (id == null || id == "") {
                                return "";
                            }
                            try {
                                if (rowData[reverseLookup["Apply"]] == "Already Applied") {
                                    return "Applied";
                                } else if (rowData[reverseLookup["Short List"]] == "On Short List") {
                                    return "Shortlisted";
                                } else if (SearchManager.hasRead(id)) {
                                    return "Read";
                                }
                            } catch (e) {
                                return MESSAGE.UNHIDE_COLUMNS;
                            }
                            return "New";
                        })
                        .applyFilter("Job Title", function(cell, row, rowData, reverseLookup) {
                            var trackJS = cell.getTextBetween("javascript:", ";\"");
                            var data = TABLEFILTERS.jobDescription(cell, row, rowData, reverseLookup);
                            if (rowData[reverseLookup["Read Status"]] == "New") {
                                var id = rowData[reverseLookup["Job Identifier"]];
                                data = data.replace('<a ', '<a onmousedown="if(event.which<3){markRead(' + row + ',' + parseInt(id, 10) + ');}' + trackJS + ';" ');
                            }
                            return data;
                        })
                        .applyFilter("Apply", function(cell, row, rowData, reverseLookup) {
                            return cell.replace('href="javascript:', 'href="javascript:window.parent.hideFrame = null;');
                        })
                        //.applyFilter("Apply", TABLEFILTERS.fixApply)        //TODO fix bug when changing pages
                        .applyFilter("Short List", function(cell, row, rowData, reverseLookup) {
                            var action = cell.match(/hAction[^;]+;/);
                            if (action == null) {
                                return cell
                            }
                            action = action[0];
                            return '<span onclick="' + action + 'onShortList(' + row + ',' + reverseLookup['Short List'] + ');" class="fakeLink">Add to Short List</span>';
                        }).addControlButton("Clear Read History", function() {
                            if (!confirm("Would you like to delete all your read status history? All jobs under search will now be set to the 'new' status.")) {
                                return;
                            }
                            SearchManager.clearAll();
                            showMessage("Read status history was successfully deleted.");
                            table0.jInstance.find("tbody tr").children(":first-child:contains('Read')").text("New");
                        })
                        .appendTo(form);

                    var appsLeft = $("#UW_CO_JOBSRCHDW_UW_CO_MAX_NUM_APPL").plainText();
                    $("#jbmnpls_Results_TableCount").parent().append(" | Total Jobs: <span id='jbmnpls_total_job'>" + table0.jobLength + "</span>");
                    if (PREF.load("SETTINGS_PAGES_AUTO_SEARCH", null, false)) {
                        showPopup(false, "Please wait while Jobmine receives the search results.<br/><br/><img src='" + IMAGES.LARGE_LOADING + "'/>", "Search is in Progress", 550);
                    }

                    //Update the statusbar
                    BRIDGE.run(function() {
                        var appLeftNode = window.parent.document.getElementById('jbmnpls-status-apps-left');
                        if (appLeftNode) {
                            appLeftNode.innerHTML = appsLeft;
                        }
                    }, null, {
                        appsLeft: appsLeft
                    });
                }
                break;
            case PAGES.INTERVIEWS:
                { /*Expand to see what happens when you reach the interviews page*/
                    var interviewTable = makeTable(null, "UW_CO_STUD_INTV$scroll$0");
                    var groupTable = makeTable(null, "UW_CO_GRP_STU_V$scroll$0");
                    var socialTable = makeTable(null, "UW_CO_NSCHD_JOB$scroll$0");
                    var cancelTable = makeTable(null, "UW_CO_SINT_CANC$scroll$0");
                    form.children("div").remove(); //Remove useless stuff
                    interviewTable.insertColumn("Google Calendar", TABLECOLUMNS.googleCalendar);
                    groupTable.insertColumn("Google Calendar", TABLECOLUMNS.googleCalendarGroup);

                    //Apply Filters, and append the tables
                    for (var i = 0; i < TABLES.length; i++) {
                        TABLES[i].applyFilter("Job Title", TABLEFILTERS.jobDescription);
                    }
                    interviewTable.applyFilter("Job ID", TABLEFILTERS.jobInterviews).applyFilter("Interviewer", TABLEFILTERS.interviewerSearch)
                        .applyFilter("Employer Name", TABLEFILTERS.googleSearch).appendTo(form);
                    groupTable.applyFilter("Employer Name", TABLEFILTERS.googleSearch).applyFilter("Job ID", TABLEFILTERS.jobInterviews).appendTo(form);
                    socialTable.applyFilter("Employer Name", TABLEFILTERS.googleSearch).applyFilter("Job Identifier", TABLEFILTERS.jobInterviews).appendTo(form);
                    cancelTable.applyFilter("Employer", TABLEFILTERS.googleSearch).appendTo(form);

                    // Store interviews count
                    var key = 'INTERVIEWS_COUNT';

                    // First time, initialize with the interview count
                    if (OBJECTS.STORAGE.getItem(key) === null) {
                        OBJECTS.STORAGE.setItem(key, interviewTable.data.length);
                    }

                    var prev = window.parseInt(OBJECTS.STORAGE.getItem(key), 10);
                    var curr = interviewTable.data.length;
                    var diff = curr - prev;

                    if (diff <= 0) {
                        console.log('No new interviews');
                        break;
                    }

                    // Update the interview count
                    OBJECTS.STORAGE.setItem(key, curr);

                    // Interview Browser Notification
                    if (!window.Notification) {
                        console.log('Notifications API not supported on this browser.');
                        break;
                    }

                    var plural = diff > 1 ? 's' : '';
                    var msg = 'You have ' + diff  + ' new interview' + plural;
                    var ACCESS_GRANTED = 'granted';
                    var ACCESS_DENIED = 'denied';

                    if (Notification.permission === ACCESS_GRANTED) {
                        var notification = new Notification(msg);
                        break;
                    }

                    if (Notification.permission !== ACCESS_DENIED) {
                        Notification.requestPermission(function(permission) {
                            // If the user accepts, let's create a notification
                            if (permission === ACCESS_GRANTED) {
                                var notification = new Notification(msg);
                            }
                        });
                    }
                }
                break;
            case PAGES.RANKINGS:
                { /*Expand to see what happens when you reach the rankings page*/
                    //var table0 = makeTable("Rankings", "UW_CO_STU_RNKV2$scroll$0");
                    //var text = $(UTIL.getID('#ICSave')).attr("onclick").getTextBetween("javascript:", ";");
                    //form.children("div").remove();
                    //table0.addControlButton("Save", function(){
                    //         BRIDGE.run("function(){"+text+"}");
                    //      })
                    //      .applyFilter("Job Title", TABLEFILTERS.jobDescription)
                    //      .applyFilter("Employer", TABLEFILTERS.googleSearch)
                    //      .applyFilter("Work location", TABLEFILTERS.googleMap)
                    //      .addControlButton("Rankings Info", "http://www.cecs.uwaterloo.ca/manual/first_cycle/4_11.php").appendTo(form);
                    //$("#"+table0.id+" div.jbmnplsTableControls span:contains('Save')").addClass("important");

                    $(UTIL.getID('#ICSave')).click(function() {
                        showMessage("Trying to Save...", 6000);
                    });
                }
                break;
            case PAGES.DOCUMENTS:
                { /*Expand to see what happens when you reach the documents page*/
                    // Lazy styling without removing elements
                    var docCSS = {
                        "#win0divPSPANELTABS, \
                 #PAGEBAR, \
                 #ACE_width > tbody > tr:nth-child(1), \
                 #ACE_width > tbody > tr:nth-child(2), \
                 #ACE_width > tbody > tr:nth-child(3) \
                ": {
                            "display": "none !important",
                        }
                    };
                    appendCSS(docCSS);

                    // Show message when going to download pdf
                    $("#UW_CO_PDF_LINKS_UW_CO_MARKS_VIEW, #UW_CO_PDF_LINKS_UW_CO_WHIST_VIEW")
                        .add(document.getElementById("UW_CO_PDF_LINKS_UW_CO_DOC_VIEW$0"))
                        .add(document.getElementById("UW_CO_PDF_LINKS_UW_CO_DOC_VIEW$1"))
                        .add(document.getElementById("UW_CO_PDF_LINKS_UW_CO_DOC_VIEW$2"))
                        .add(document.getElementById("UW_CO_PDF_LINKS_UW_CO_PACKAGE_VIEW$0"))
                        .add(document.getElementById("UW_CO_PDF_LINKS_UW_CO_PACKAGE_VIEW$1"))
                        .add(document.getElementById("UW_CO_PDF_LINKS_UW_CO_PACKAGE_VIEW$2"))
                        .click(function() {
                            showMessage('Please wait, retrieving download...');
                        });
                }
                break;
            case PAGES.LIST:
                { /*Expand to see what happens when you reach the job shortlist page*/
                    //Handles multi delete
                    function handleCheckedDelete() {
                        //Get all the rows to delete
                        var listToDelete = [];
                        $("#" + table.tableID + " input.checkbox:checked").each(function(r) {
                            listToDelete.push(this.parentNode.parentNode.getAttribute("row"));
                        });
                        if (listToDelete.empty()) {
                            return;
                        }
                        if (!confirm("Would you like to delete these rows?\nThere are " + listToDelete.length + " rows to delete and it might take a while.\n\nYou can refresh anytime to cancel.")) {
                            return;
                        }
                        listToDelete.sort(function(a, b) {
                            return b - a;
                        });
                        var command = table.jInstance.find("tbody div.delete:eq(0)").attr("action");
                        var progress = "1/" + listToDelete.length;
                        setTitle("Deleting: " + progress);
                        showPopup(false, "Deleting all the short listed jobs.<br/>Progress: " + progress + "<br/><span style='color:blue;'>You can cancel by refreshing.</span><br/><br/><img src='" + IMAGES.LARGE_LOADING + "'/>", "Please Be Patient", 500, 300);
                        var deletion = new Job("submitAction_win0(document.win0, '" + command + "')", listToDelete);
                        JOBQUEUE.addJob(deletion);
                    }

                    form.find("div").css("display", "none");
                    var table = makeTable("Jobs", "UW_CO_STUJOBLST$scrolli$0");
                    table.applyFilter("", TABLEFILTERS.deleteRow);
                    if (table.columns > 8) {
                        table.setHeaderAt(8, "Delete");
                    } else {
                        showMessage(MESSAGE.UNHIDE_COLUMNS_PAGE, 12);
                    }
                    table.applyFilter("Job Title", TABLEFILTERS.jobDescription)
                        .applyFilter("Employer Name", TABLEFILTERS.googleSearch)
                        .applyFilter("Location", TABLEFILTERS.googleMap)
                        .applyFilter("Apply", TABLEFILTERS.fixApply)
                        .addControlButton("Select All", function() {
                            $("#" + table.tableID + " input.checkbox").attr("checked", true).parent().parent().addClass("selected");
                        })
                        .addControlButton("Select None", function() {
                            $("#" + table.tableID + " input.checkbox").attr("checked", false).parent().parent().removeClass("selected");
                        })
                        .addControlButton("Delete Selected", handleCheckedDelete)
                        .addCheckboxes()
                        .appendTo(form);
                    $(document.body).scrollTop(0);
                    var appsLeft = $("#UW_CO_JOBSRCHDW_UW_CO_MAX_NUM_APPL").plainText();
                    $("#jbmnpls_Jobs_TableCount").parent().append(" | Applications Left: <span id='jbmnpls_Results_AppsLeft'>" + appsLeft + "</span>");
                    //Update the remaining applications
                    BRIDGE.run(function() {
                        var appLeftNode = window.parent.document.getElementById('jbmnpls-status-apps-left');
                        if (appLeftNode) {
                            appLeftNode.innerHTML = appsLeft;
                        }
                    }, null, {
                        appsLeft: appsLeft
                    });
                }
                break;
            case PAGES.APPLICATIONS:
                { /*Expand to see what happens when you reach the applications page*/
                    //Pull and make new tables
                    var activeApp = makeTable(null, "UW_CO_STU_APPSV$scroll$0");
                    activeApp.applyFilter("Job Title", TABLEFILTERS.jobDescription)
                        .applyFilter("View Details", TABLEFILTERS.fixApply)
                        .applyFilter("Employer", TABLEFILTERS.googleSearch)
                        .applyFilter("Job Status", function(cell, row, rowData, reverseLookup) {
                            if (reverseLookup.hasOwnProperty("Job ID")) {
                                var id = rowData[reverseLookup["Job ID"]];
                                if (cell == "Ranking Complete" && OBJECTS.STORAGE.getItem("INTERVIEWS_ID_" + id) != undefined) {
                                    // Store the previous counts
                                    var prevActive = OBJECTS.STORAGE.getItem('ACTIVE_APPS_COUNT');
                                    var prevAll = OBJECTS.STORAGE.getItem('ALL_APPS_COUNT');

                                    OBJECTS.STORAGE.setItem('PREV_ACTIVE_APPS_COUNT', prevActive);
                                    OBJECTS.STORAGE.setItem('PREV_ALL_APPS_COUNT', prevAll);

                                    // Update the ranked jobs count
                                    var storeKey = 'ACTIVE_RANKING_COMPLETED_COUNT';
                                    var rankedCount = window.parseInt(OBJECTS.STORAGE.getItem(storeKey), 10);
                                    // Store the ranked count for the first time
                                    if (!rankedCount) {
                                        OBJECTS.STORAGE.setItem(storeKey, 1);
                                    } else if (rankedCount) {
                                        // Increment the count
                                        OBJECTS.STORAGE.setItem(storeKey, rankedCount++);
                                    }
                                    return "<span title='According to the Jobmine glitch, if you have Ranking Complete in Active Applications, this means you have been ranked OR you have been offered this job.'>Ranked or Offered</span>";
                                }
                            }
                            return cell;
                        })
                        .appendTo(form);

                    var allApp = makeTable(null, "UW_CO_APPS_VW2$scrolli$0");
                    var columnLength = allApp.columns;
                    if (allApp.columns > 11) {
                        // Apply the delete button
                        allApp.applyFilter(columnLength - 1, TABLEFILTERS.deleteRow)
                            .setHeaderAt(columnLength - 1, "Delete");
                    } else {
                        showMessage(MESSAGE.UNHIDE_COLUMNS_PAGE, 12);
                    }
                    allApp.applyFilter("Job Title", TABLEFILTERS.jobDescription)
                        .applyFilter("View Details", TABLEFILTERS.fixApply)
                        .applyFilter("Employer", TABLEFILTERS.googleSearch)
                        .appendTo(form);
                    //Clean up all webpage :P
                    form.children("div:not('.jbmnplsTable')").css("display", "none");

                    //Store and update the active applications count
                    OBJECTS.STORAGE.setItem('ACTIVE_APPS_COUNT', activeApp.rows);
                    OBJECTS.STORAGE.setItem('ALL_APPS_COUNT', allApp.rows);
                    changeStatusValues(activeApp.rows);

                    // Determine offer or rank from glitch
                    var prevActive = window.parseInt(OBJECTS.STORAGE.getItem('PREV_ACTIVE_APPS_COUNT'), 10);
                    var prevAll = window.parseInt(OBJECTS.STORAGE.getItem('PREV_ALL_APPS_COUNT'), 10);
                    var currActive = activeApp.rows;
                    var currAll = allApp.rows;

                    if (!prevActive || !prevAll) {
                        break;
                    }

                    // Apps remaining
                    var prevDiff = prevAll - prevActive;
                    var currDiff = currAll - currActive;
                    var numOffers = currDiff - prevDiff;

                    var plural = numOffers > 1 ? 's' : '';
                    if (numOffers > 0) {
                        window.alert('Congrats! You potentially have ' + numOffers + ' offer' + plural + ' according to JobMine glitch.');
                    }
                }
                break;
            case PAGES.PROFILE:
                { /*Expand to see what happens when you reach the profile page*/
                    var table0 = makeTable("Profile", "UW_CO_STDTERMVW$scroll$0");
                    addProfileNav();
                    form.children("div").remove();
                    table0.appendTo(form);
                }
                break;
            case PAGES.PERSONAL:
            case PAGES.ACADEMIC:
            case PAGES.SKILLS:
                { /*Expand to see what happens when you reach the personal profile page*/
                    var saveButton = UTIL.getID('#ICSave');
                    if (saveButton) {
                        var obj = $(saveButton.parentNode.parentNode);
                        if (obj.hasClass('PSPUSHBUTTONDISABLED')) {
                            saveButton = null;
                        } else {
                            var saveHTML = obj.outerHTML();
                        }
                    }
                    addProfileNav();
                    form.children("div:not('#PAGECONTAINER')").remove();
                    $("#win0divPSTOOLBAR").remove();
                    $("#PAGECONTAINER>table").css("margin", "0 auto");
                    $("#ACE_width").removeAttr("width").find("tbody>tr:eq(0)>td").eq(-1).remove();
                    if (saveButton) {
                        $("#PAGECONTAINER").append(saveHTML);
                    }
                }
                break;
        }
        BRIDGE.addJS(function() {
            if (window.parent.showFrame) {
                window.parent.showFrame();
            }
        });
        break;
}
