// eslint(no-undef)
if (typeof Sys != "undefined") {
  var postBackQueue = new Array()
  var executingElement = null
  var executingElementArgs = null
  var prm = Sys.WebForms.PageRequestManager.getInstance()

  prm.add_initializeRequest(PRMInitializeRequest)
  prm.add_endRequest(PRMEndRequest)
  prm.add_beginRequest(PRMBeginRequest)
}

var postBackElementFocus = null
var PRMRequestStatus = ""
var HideHourglassAndShowMessageExecuted = true
var HideHourglassAndShowMessagePosponed = false

function PRMInitializeRequest(sender, args) {
  PRMRequestStatus = "PRMInitializeRequest"

  if (prm.get_isInAsyncPostBack()) {
    var postBackElement = args.get_postBackElement()

    if (executingElement != postBackElement) {
      var evArg = $get("__EVENTARGUMENT").value

      args.set_cancel(true)
      Array.enqueue(postBackQueue, new Array(postBackElement, evArg))
    }

    executingElement = null
  }

  postBackElementFocus = args.get_postBackElement()
}

function PRMBeginRequest() {
  PRMRequestStatus = "PRMBeginRequest"

  prm._scrollPosition = null

  if (
    postBackElementFocus != null &&
    postBackElementFocus.className != "hidden"
  ) {
    document.getElementById(postBackElementFocus.id).focus()
  }
}

function PRMEndRequest(sender, args) {
  PRMRequestStatus = "PRMEndRequest"

  if (postBackQueue.length > 0) {
    var queueElement = Array.dequeue(postBackQueue)

    executingElement = queueElement[0]
    executingElementArgs = queueElement[1]

    prm._doPostBack(executingElement.name, executingElementArgs)
  }

  HideHourglassAndShowMessageExecuted = false

  if (HideHourglassAndShowMessagePosponed) HideHourglassAndShowMessage()
}

function GetRadWindow() {
  var objWindow = null
  if (window.radWindow) objWindow = window.radWindow
  else if (window.frameElement && window.frameElement.radWindow)
    objWindow = window.frameElement.radWindow
  else objWindow = this.window
  return objWindow
}

function OnCancel() {
  GetRadWindow().close(null)
}

function CloseAndRebind(args) {
  var objWindow = GetRadWindow()
  if (objWindow) {
    objWindow.BrowserWindow.location.reload()
    objWindow.close()
  }
}

function CancelEdit() {
  GetRadWindow().close()
}

function DisplayCharts() {
  var $Feedback = $(".chart-feedback")
  var nSize = 14

  for (i = 0; i <= $Feedback.length - 1; i++) {
    var nValue = $($Feedback[i]).attr("value")
    var nMaxValue = $($Feedback[i]).attr("max-value")
    var sColor = $($Feedback[i]).attr("color")
    var sHtml = ""
    var sSqTpl =
      "<rect x='__x' y='2' rx='2' ry='2' width='__width' height='" +
      nSize +
      "' fill='__color' stroke='__color' stroke-width='2' />"
    var sLnTpl =
      "<line x1='__x1' y1='1' x2='__x2' y2='__y2' fill='__color' stroke='__color' stroke-width='2' />"

    sHtml =
      "<svg width='" +
      String(nMaxValue * (nSize + 4)) +
      "' height='" +
      String(nSize + 3) +
      "'>"

    for (j = 0; j <= nMaxValue - 1; j++) {
      var sUnit = sSqTpl
      var sPart = ""
      var Color = new RegExp("__color", "g")

      sUnit = sUnit.replace("__x", 2 + j * (nSize + 4))
      sUnit = sUnit.replace("__width", nSize)

      if (j < nValue) {
        var nFillRatio = nValue - j

        nFillRatio = nFillRatio > 0.9 ? 1 : nFillRatio < 0.1 ? 10 : nFillRatio

        if (0 < nFillRatio && nFillRatio < 1) {
          var nPartSize = nFillRatio * nSize - 1

          sUnit = sUnit.replace(Color, "#eeeeee")

          sPart = sSqTpl
          sPart = sPart.replace("__x", 2 + j * (nSize + 4))
          sPart = sPart.replace("__width", nPartSize)

          sPart += sLnTpl
          sPart = sPart.replace("__x1", 2 + j * (nSize + 4) + nPartSize)
          sPart = sPart.replace("__x2", 2 + j * (nSize + 4) + nPartSize)
          sPart = sPart.replace("__y2", nSize + 3)

          sPart = sPart.replace(Color, sColor)
        } else {
          sUnit = sUnit.replace(Color, sColor)
        }
      } else {
        sUnit = sUnit.replace(Color, "#eeeeee")
      }

      sHtml += sUnit + sPart
    }

    sHtml += "</svg>"

    $($Feedback[i]).html(sHtml)
  }
}

function PanelCollapse(elemID, statusID) {
  if ($("#" + elemID) == undefined) return

  if (statusID == "show") {
    $("#" + elemID + "Button").attr("aria-expanded", "true")
    $("#" + elemID + "Button").attr("class", "")
    $("#" + elemID + "Panel").attr("aria-expanded", "true")
    $("#" + elemID + "Panel").attr("class", "panel-collapse collapse in")
    $("#" + elemID + "Panel").attr("style", "")
  } else {
    $("#" + elemID + "Button").attr("aria-expanded", "false")
    $("#" + elemID + "Button").attr("class", "collapsed")
    $("#" + elemID + "Panel").attr("aria-expanded", "false")
    $("#" + elemID + "Panel").attr("class", "panel-collapse collapse")
    $("#" + elemID + "Panel").attr("style", "height: 0px;")
  }
}

function panelExpandCollapseAll(sExpandCollapse) {
  $('[role="tablist"]').each(function() {
    if (sExpandCollapse == "expand") PanelCollapse($(this).attr("id"), "show")

    if (sExpandCollapse == "collapse") PanelCollapse($(this).attr("id"), "hide")
  })

  if (sExpandCollapse == "expand") SaveState("expandAll", "false")

  if (sExpandCollapse == "collapse") SaveState("collapseAll", "false")
}

function WireAccordionEvents() {
  $('[role="button"]').click(function() {
    var currentItem = $(this).attr("id")
    currentItem = currentItem.replace("Button", "")

    SaveState(currentItem, $(this).attr("aria-expanded"))
  })

  $('[type="expandAll"]').click(function() {
    panelExpandCollapseAll("expand")
  })

  $('[type="collapseAll"]').click(function() {
    panelExpandCollapseAll("collapse")
  })
}

function GetPageAccordionState(CompanyID, UserRef, PageName) {
  var accordionState = ""

  $.ajax({
    url:
      "../Common/CfgSaveState.aspx?CompanyID=" +
      CompanyID +
      "&UserRef=" +
      UserRef +
      "&Page=" +
      PageName,
    type: "get",
    dataType: "text",
    async: false,
    success: function(data) {
      accordionState = data
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert(errorThrown)
    }
  })

  return accordionState
}

function GetAccordionState(accordionState, accordion) {
  if (accordionState.indexOf("{" + accordion + "}0{/" + accordion + "}") >= 0)
    return "hide"

  if (
    accordionState.indexOf("{expandAll}1{/expandAll}") >= 0 ||
    accordionState.indexOf("{" + accordion + "}1{/" + accordion + "}") >= 0
  )
    return "show"
  else return "hide"
}

function HttpRequest(sCommand) {
  var today = new Date()
  var request = $.ajax({
    url: sCommand + "&dt=" + today,
    cache: false
  })

  request.fail(function(jqXHR, textStatus) {
    alert("Request failed: " + textStatus)
  })
}

;(function($) {
  $.fn.openDialog = function() {
    var scrollTop = $(window).scrollTop()
    var dialogCss =
      ($(this).attr("dialog-additional-css") == undefined
        ? "dialog-md"
        : $(this).attr("dialog-additional-css")) + " ui-dialog-full-height"
    var containerCss =
      $(this).attr("dialog-container-css") == undefined
        ? "dialog-container"
        : $(this).attr("dialog-container-css")
    var marginTop =
      $(this).attr("dialog-margin-top") == undefined
        ? "0"
        : $(this).attr("dialog-margin-top")
    var marginBtm =
      $(this).attr("dialog-margin-bottom") == undefined
        ? "0"
        : $(this).attr("dialog-margin-bottom")
    var popupUrl = $(this).attr("dialog-url")
    var displayElem =
      $(this).attr("dialog-display-element") == undefined
        ? ""
        : $(this).attr("dialog-display-element")
    var timer = null

    $(":focus").blur()

    var $popup = $("<div class='popup-dialog'></div>")
      .html('<div class="loading">Loading...</div>')
      .dialog({
        dialogUrl:
          popupUrl != undefined
            ? popupUrl + (popupUrl.indexOf("&Dialog=") == -1 ? "&Dialog=1" : "")
            : "",
        dialogElement: $(this).attr("dialog-display-element"),
        dialogContainerCss: containerCss,
        autoOpen: false,
        show: { effect: "fade", speed: 2000 },
        hide: { effect: "fade", speed: 500 },
        modal: true,
        draggable: false,
        resizable: false,
        autoResize: false,
        position: [0, 0],
        //height: "0",
        classes: {
          "ui-dialog": dialogCss
        },
        open: function(event, ui) {
          $("#divSiteMain").attr("scrollTop", scrollTop)
          $("#divSiteMain").css({
            "margin-top": "-" + scrollTop + "px",
            "overflow-y": "hidden"
          })

          if (scrollTop > 55) {
            $("#divSiteTopNav").css({
              display: "none"
            })
          }

          $("body").css({
            "-webkit-overflow-scrolling": "touch",
            "overflow-y": "hidden",
            "padding-right":
              $(document).height() > $(window).height() ? "16px" : "0"
          })

          $("#divSiteTopNav").css({
            "overflow-y": "hidden",
            "padding-right":
              $(document).height() > $(window).height() ? "16px" : "0"
          })

          var dialogUrl = $(this).dialog("option", "dialogUrl")
          var dialogElement = $(this).dialog("option", "dialogElement")
          var dialogContainerCss = $(this).dialog(
            "option",
            "dialogContainerCss"
          )

          if (dialogUrl == null || dialogUrl == "") {
            $(this).html(
              (dialogContainerCss == null
                ? ""
                : '<div class="' + dialogContainerCss + '">') +
                $(dialogElement).html() +
                (dialogContainerCss == null ? "" : "</div>")
            )

            $("div[role='dialog']").each(function() {
              var dialog = $(this)

              dialog.css({
                top: marginTop + "px",
                "overflow-y": "scroll",
                "overflow-x": "hidden",
                height:
                  (
                    $(window).height() -
                    Number(marginTop) -
                    Number(marginBtm)
                  ).toString() + "px"
              })

              dialog.find(".ui-dialog-titlebar").css("visibility", "visible")
            })
          } else {
            var loading = ""

            loading +=
              '<div id="divDlgWait" style="display: inline-block; position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 70px; height: 70px; margin: auto; text-align: center !important;">'
            loading +=
              '<img alt="" src="../images/loading.gif" style=" height: 64px; width: 64px;" />'
            loading += "</div>"

            $(this).html(
              dialogContainerCss == null
                ? ""
                : loading +
                    '<iframe style="width: 100%; display: block; overflow-y: hidden; height: 9999999px; " src="' +
                    dialogUrl +
                    '"></iframe>'
            )

            $("iframe").on("load", function() {
              $("div[role='dialog']").each(function() {
                var dialog = $(this)
                var iframe = $(this).find("iframe")

                $("#divDlgWait").css("display", "none")

                dialog.css({
                  top: marginTop + "px",
                  "overflow-y": "scroll",
                  "overflow-x": "hidden",
                  height:
                    (
                      $(window).height() -
                      Number(marginTop) -
                      Number(marginBtm)
                    ).toString() + "px"
                })

                iframe
                  .contents()
                  .find("body")
                  .css({ "overflow-y": "hidden" })

                if (
                  iframe
                    .contents()
                    .find(".dialog-container")
                    .height() != null
                )
                  dialog.find(".ui-dialog-content").css(
                    "height",
                    iframe
                      .contents()
                      .find(".dialog-container")
                      .height() + "px"
                  )
                else
                  dialog.find(".ui-dialog-content").css(
                    "height",
                    iframe
                      .contents()
                      .find("#divSiteMain")
                      .height() + "px"
                  )

                dialog.find(".ui-dialog-titlebar").css("visibility", "visible")
              })
            })
          }

          $popup.dialog(
            "option",
            "height",
            window.parent.$("#divSiteMain").height() - scrollTop
          )
          window.scrollTo(0, 0)
          document.activeElement.blur()
        },
        close: function(event, ui) {
          var newDialogId = $("#divSiteMain").attr("dialog-onclose-open-dialog")

          $("body").css({
            "overflow-y": "",
            "padding-right": ""
          })

          $("#divSiteTopNav").css({
            "overflow-y": "",
            display: "",
            "padding-right": ""
          })

          $("#divSiteMain").css({
            "margin-top": "",
            height: "",
            "overflow-y": ""
          })

          $(window).scrollTop($("#divSiteMain").attr("scrollTop"))

          if (
            newDialogId != undefined &&
            newDialogId != null &&
            newDialogId != ""
          ) {
            $("#divSiteMain").removeAttr("dialog-onclose-open-dialog")
            window.parent.document.getElementById(newDialogId).click()
          }

          $(this).remove()
          clearInterval(timer)
        }
      })

    $(window).resize(function() {
      $("div[role='dialog']").each(function() {
        var dialog = $(this)

        dialog.css({
          height:
            (
              $(window).height() -
              Number(marginTop) -
              Number(marginBtm)
            ).toString() + "px"
        })

        if (displayElem != "") {
          dialog.find(".ui-dialog-content").css("height", "unset")
        } else {
          var iframe = dialog.find("iframe")

          if (
            iframe
              .contents()
              .find(".dialog-container")
              .height() != null
          ) {
            dialog.find(".ui-dialog-content").css(
              "height",
              iframe
                .contents()
                .find(".dialog-container")
                .height() + "px"
            )
          } else {
            if (
              iframe
                .contents()
                .find(".dialog-container")
                .height()
            )
              dialog.find(".ui-dialog-content").css(
                "height",
                iframe
                  .contents()
                  .find("#divSiteMain")
                  .height() + "px"
              )
            else
              dialog
                .find(".ui-dialog-content")
                .css(
                  "height",
                  window.parent.$("#divSiteMain").height() - scrollTop + "px"
                )
          }
        }
      })
    })

    timer = setInterval(function() {
      $("div[role='dialog']").each(function() {
        var dialog = $(this)

        dialog.css({
          height:
            (
              $(window).height() -
              Number(marginTop) -
              Number(marginBtm)
            ).toString() + "px"
        })

        if (displayElem != "") {
          dialog.find(".ui-dialog-content").css("height", "unset")
        } else {
          var iframe = dialog.find("iframe")

          if (
            iframe
              .contents()
              .find(".dialog-container")
              .height() != null
          ) {
            dialog.find(".ui-dialog-content").css(
              "height",
              iframe
                .contents()
                .find(".dialog-container")
                .height() + "px"
            )
          } else {
            if (
              iframe
                .contents()
                .find(".dialog-container")
                .height()
            )
              dialog.find(".ui-dialog-content").css(
                "height",
                iframe
                  .contents()
                  .find("#divSiteMain")
                  .height() + "px"
              )
            else
              dialog
                .find(".ui-dialog-content")
                .css(
                  "height",
                  window.parent.$("#divSiteMain").height() - scrollTop + "px"
                )
          }

          if (marginBtm != "0") dialog.removeClass("ui-dialog-full-height")
        }
      })
    }, 500)

    $popup.dialog("open")
  }

  $.fn.closePopup = function() {
    alert("close popup")
  }
})(jQuery)

function checkOverflow(el) {
  var heightChildren = 0

  el.children().each(function() {
    if ($(this).css("display") != "none") heightChildren += $(this).height()
  })

  return heightChildren > el.height() ? true : false
}

function dialogDeleteConfirm(dialogText, okFunc, cancelFunc, dialogTitle) {
  $(
    '<div class="confirm-dialog-container delete-dialog"><div class="confirm-dialog-title">' +
      dialogTitle +
      '</div><div class="confirm-dialog-content">' +
      dialogText +
      "</div></div>"
  ).dialog({
    draggable: false,
    modal: true,
    resizable: false,
    width: "auto",
    title: "",
    minHeight: 75,
    buttons: [
      {
        text: "Delete",
        class: "btn btn-danger",
        click: function() {
          if (typeof okFunc == "function") {
            setTimeout(okFunc, 50)
          }
          $(this).dialog("destroy")
        }
      },
      {
        text: "Cancel",
        class: "btn btn-default",
        click: function() {
          if (typeof cancelFunc == "function") {
            setTimeout(cancelFunc, 50)
          }
          $(this).dialog("destroy")
        }
      }
    ],
    open: function(event, ui) {
      $(this)
        .parent()
        .focus()
    }
  })
}

function dialogConfirm(dialogText, okFunc, cancelFunc, dialogTitle) {
  $(
    '<div class="confirm-dialog-container delete-dialog"><div class="confirm-dialog-title">' +
      dialogTitle +
      '</div><div class="confirm-dialog-content">' +
      dialogText +
      "</div></div>"
  ).dialog({
    draggable: false,
    modal: true,
    resizable: false,
    width: "auto",
    title: "",
    minHeight: 75,
    buttons: [
      {
        text: "Ok",
        class: "btn btn-success",
        click: function() {
          if (typeof okFunc == "function") {
            setTimeout(okFunc, 50)
          }
          $(this).dialog("destroy")
        }
      },
      {
        text: "Cancel",
        class: "btn btn-default",
        click: function() {
          if (typeof cancelFunc == "function") {
            setTimeout(cancelFunc, 50)
          }
          $(this).dialog("destroy")
        }
      }
    ],
    open: function(event, ui) {
      $(this)
        .parent()
        .focus()
    }
  })
}

function dialogMessage(dialogText, okFunc, dialogTitle) {
  $(
    '<div class="confirm-dialog-container"><div class="confirm-dialog-title">' +
      dialogTitle +
      '</div><div class="confirm-dialog-content">' +
      dialogText +
      "</div></div>"
  ).dialog({
    draggable: false,
    modal: true,
    resizable: false,
    width: "auto",
    title: "",
    minHeight: 75,
    buttons: {
      OK: function() {
        if (typeof okFunc == "function") {
          setTimeout(okFunc, 50)
        }
        $(this).dialog("destroy")
      }
    }
  })
}

function InitComponents() {
  $(":input").inputmask()
  $(".date")
    .not(".custom-format")
    .datetimepicker({
      format: "MMM DD, YYYY",
      useCurrent: false,
      keyBinds: "t:"
    })
  $(".time")
    .not(".custom-format")
    .datetimepicker({ format: "LT", useCurrent: false, keyBinds: "t:" })
  $(".datetime")
    .not(".custom-format")
    .datetimepicker({
      format: "MMM DD, YYYY LT",
      useCurrent: false,
      keyBinds: "t:"
    })
  $('[data-plugin="select2"]:not(".no-init")').select2({
    selectOnClose: false,
    width: "100%",
    placeholder: "None Selected",
    allowClear: true
  })
  $('[data-toggle="tooltip"]').tooltip()

  $(".slick-single-item").each(function() {
    if (!$(this).hasClass("slick-initialized")) {
      $(this).slick({
        prevArrow:
          '<a class="slick-carousel-control left"><span class="glyphicon glyphicon-chevron-left"></span></a>',
        nextArrow:
          '<a class="slick-carousel-control right"><span class="glyphicon glyphicon-chevron-right"></span></a>',
        dots: true,
        slidesToShow: 1,
        focusOnSelect: true,
        customPaging: function(slider, i) {
          var thumb = $(slider.$slides[i]).data()
          return '<a class="dot slick-dot"></a>'
        }
      })
    }
    $(this).css({
      height: "auto",
      visibility: "visible"
    })
  })

  $(".panel-slick-table").slick({
    arrows: false,
    centerMode: true,
    centerPadding: "20px",
    slidesToShow: 1
  })

  if (typeof InitCustomComponents === "function") InitCustomComponents()
}

function InitDataTable(GridViewID, SearchFieldID, Responsive, Paging, Message) {
  var table = $("#" + GridViewID).DataTable({
    columnDefs: [
      {
        targets: "datatable-nosort",
        orderable: false
      }
    ],
    responsive: Responsive,
    stateSave: true,
    mark: true,
    autoWidth: false,
    ordering: false,
    paging: Paging,
    info: Paging,
    pagingType: "numbers",
    dom: '<"top"<"clear">>rt<"bottom"pl<"clear">>',
    lengthMenu: [
      [25, 50, 100, -1],
      [25, 50, 100, "All"]
    ],
    language: {
      lengthMenu: "Display _MENU_ records per page",
      zeroRecords: "No records found",
      info: "Showing page _PAGE_ of _PAGES_",
      infoEmpty: "No records available",
      infoFiltered: "(filtered from _MAX_ total records)"
    }
  })

  if (SearchFieldID != null && $("#" + SearchFieldID).val() != undefined) {
    var inputSearchVal = table.search()

    $("#" + SearchFieldID).val(inputSearchVal)
    table.search($("#" + SearchFieldID).val()).draw(false)

    $("#" + SearchFieldID).on("keyup", function() {
      table.search(this.value).draw()
    })
  } else {
    table.search("", true).draw()
  }

  if (Message != undefined && Message != null)
    $("#" + GridViewID + "_paginate").after(
      "<div style='float: left; padding-top: 8px; padding-left: 10px;'>" +
        Message +
        "</div>"
    )

  $("#" + GridViewID).removeClass("hidden-onload")
}

function InitDataTableWithGrouping(
  GridViewID,
  SearchFieldID,
  Responsive,
  Paging,
  Message,
  GroupColumnIndex
) {
  var table = $("#" + GridViewID).DataTable({
    columnDefs: [
      {
        targets: "datatable-nosort",
        orderable: false
      }
    ],
    rowGroup: {
      enable: false,
      dataSrc: GroupColumnIndex,
      className: "rptGroup1"
    },
    responsive: Responsive,
    stateSave: true,
    mark: true,
    autoWidth: false,
    ordering: false,
    paging: Paging,
    info: Paging,
    pagingType: "numbers",
    dom: '<"top"<"clear">>rt<"bottom"pl<"clear">>',
    lengthMenu: [
      [25, 50, 100, -1],
      [25, 50, 100, "All"]
    ],
    language: {
      lengthMenu: "Display _MENU_ records per page",
      zeroRecords: "No records found",
      info: "Showing page _PAGE_ of _PAGES_",
      infoEmpty: "No records available",
      infoFiltered: "(filtered from _MAX_ total records)"
    },
    initComplete: function() {
      $("#" + GridViewID).removeClass("hidden")
    }
  })

  if (GroupColumnIndex != undefined) {
    table.column(GroupColumnIndex).visible(false)

    if (
      table
        .column(GroupColumnIndex)
        .data()
        .unique().length > 1
    )
      table
        .rowGroup()
        .enable()
        .draw()
  }

  if (SearchFieldID != null && $("#" + SearchFieldID).val() != undefined) {
    var inputSearchVal = table.search()

    $("#" + SearchFieldID).val(inputSearchVal)
    table.search($("#" + SearchFieldID).val()).draw(false)

    $("#" + SearchFieldID).on("keyup", function() {
      table.search(this.value).draw()
    })
  } else {
    table.search("", true).draw()
  }

  if (Message != undefined && Message != null)
    $("#" + GridViewID + "_paginate").after(
      "<div style='float: left; padding-top: 8px; padding-left: 10px;'>" +
        Message +
        "</div>"
    )

  $("#" + GridViewID).removeClass("hidden-onload")
}

var scrollBarWidth = 16
var modalPopupElement = null
var modalPopupResizeInterval = null
var modalPopupMoveTransition = "0s"

function ModalPopupOnShow(modalPopupClientID) {
  $("#divSiteTopNav").css({
    "overflow-y": "hidden",
    "padding-right":
      $(document).height() > $(window).height()
        ? (scrollBarWidth + 1).toString() + "px"
        : "0",
    "z-index": "1"
  })

  $("body").css({
    "overflow-y": "hidden",
    "padding-right":
      $(document).height() > $(window).height()
        ? scrollBarWidth.toString() + "px"
        : "0"
  })

  modalPopupElement =
    modalPopupClientID == null || modalPopupClientID == undefined
      ? $(".modal-popup")
      : $("#" + modalPopupClientID)

  modalPopupElement.css({
    display: "block"
  })

  ResizeModalPopup()

  modalPopupResizeInterval = setInterval(ResizeModalPopup, 2000)

  $("#divWait").addClass("hidden")

  if (parseInt($(".modal-popup").css("top")) < 0) {
    modalPopupElement.css({
      top: "-1px",
      position: "",
      "margin-top": "5px"
    })

    $("#divSiteMain").height(modalPopupElement.height() + 25)
    window.scrollTo(0, 0)
  }

  modalPopupElement.css({
    visibility: "visible"
  })
}

function ResizeModalPopup() {
  if (modalPopupElement != null && modalPopupElement != undefined) {
    var modalPopupHeight =
      modalPopupElement.find(".dialog-container").height() + 30

    if ($(window).height() > modalPopupHeight) {
      var temp = ($(window).height() - modalPopupHeight) / 2

      modalPopupElement.css({
        "overflow-y": "hidden",
        top: temp.toString() + "px",
        height: modalPopupHeight + "px",
        "-webkit-transition":
          "top " +
          modalPopupMoveTransition +
          ", height " +
          modalPopupMoveTransition,
        transition:
          "top " +
          modalPopupMoveTransition +
          ", height " +
          modalPopupMoveTransition
      })
    } else {
      modalPopupElement.css({
        "overflow-y": "scroll",
        top: "0px",
        height: $(window).height() + "px",
        "-webkit-transition":
          "top " +
          modalPopupMoveTransition +
          ", height " +
          modalPopupMoveTransition,
        transition:
          "top " +
          modalPopupMoveTransition +
          ", height " +
          modalPopupMoveTransition
      })
    }

    modalPopupMoveTransition =
      modalPopupMoveTransition == "0s" ? "0.2s" : modalPopupMoveTransition
  }
}

function ModalPopupOnHide() {
  if (modalPopupElement != null && modalPopupElement != undefined) {
    modalPopupElement.css({
      display: "none",
      visibility: "hidden"
    })
    InitComponents()
  }

  $("body").css({
    "overflow-y": "",
    "padding-right": ""
  })

  $("#divSiteTopNav").css({
    "overflow-y": "",
    display: "",
    "padding-right": "",
    "z-index": "2"
  })

  if (modalPopupElement != null && modalPopupElement != undefined) {
    clearInterval(modalPopupResizeInterval)
    modalPopupResizeInterval = null
    modalPopupMoveTransition = "0s"
  }

  $("#divWait").addClass("hidden")
  $("#divSiteMain").height("auto")
  toastr.clear()
}

function ModalPopupValidateForm() {
  if (modalPopupElement != null && modalPopupElement != undefined) {
    if (!$("#Form1").isValid()) {
      if (modalPopupElement != null && modalPopupElement != undefined) {
        clearInterval(modalPopupResizeInterval)
        modalPopupResizeInterval = null
      }

      ModalPopupOnShow(modalPopupElement.attr("id"))
      return false
    }
  }

  ModalPopupOnHide()

  return true
}

function ShowHourglass() {
  $("#divWait").removeClass("hidden")
}

function HideHourglass() {
  $("#divWait").addClass("hidden")
}

function HideHourglassAndShowMessage() {
  $("#divWait").addClass("hidden")

  if (
    PRMRequestStatus == "PRMBeginRequest" &&
    HideHourglassAndShowMessageExecuted == true
  ) {
    HideHourglassAndShowMessagePosponed = true
    return
  }

  InitComponents()

  $(".alert-danger:not('.no-toastr'), .alert-warning:not('.no-toastr')").each(
    function() {
      if ($(this).html() != "") {
        var timeOut = $(this).attr("timeOut")
        var message = $(this).html()
        var found = false

        if (timeOut == undefined) timeOut = 0

        $(".toast-message").each(function() {
          if ($(this).html() == message) {
            found = true
            return
          }
        })

        if (found) return

        toastr.clear()

        toastr.options = {
          closeButton: true,
          debug: false,
          newestOnTop: false,
          progressBar: false,
          positionClass: "toast-bottom-right",
          preventDuplicates: false,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          timeOut: timeOut,
          extendedTimeOut: 0,
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: false
        }

        var $toast = toastr["error"](message)

        if (typeof $toast === "undefined") {
          return
        }
      }
    }
  )

  $(".alert-success:not('.no-toastr')").each(function() {
    if ($(this).html() != "") {
      var timeOut = $(this).attr("timeOut")
      var message = $(this).html()
      var found = false

      if (timeOut == undefined) timeOut = 1000

      $(".toast-message").each(function() {
        if ($(this).html() == message) {
          found = true
          return
        }
      })

      if (found) return

      toastr.clear()

      toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        preventDuplicates: false,
        showDuration: "300",
        hideDuration: "500",
        timeOut: timeOut,
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
      }

      var $toast = toastr["success"](message)

      if (typeof $toast === "undefined") {
        return
      }
    }
  })

  HideHourglassAndShowMessageExecuted = true
  HideHourglassAndShowMessagePosponed = false
}

function DisplayPopupDialogHourglass(validateForm) {
  if (validateForm && !$("#Form1").isValid()) {
    var element = $("#Form1 .error").first()

    element.focus()
    element.select()
    return false
  }

  $("#divPopupWait").css("top", 50 + $(".panel-container").height() / 2)
  $("#divPopupWait").removeClass("hidden")
  $(".dialog-container").css("opacity", ".6")
}

function vi_delay(callback, ms) {
  var timer = 0
  return function() {
    var context = this,
      args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      callback.apply(context, args)
    }, ms || 0)
  }
}

function calcHorizontalMenuWidth() {
  var navwidth = 0
  var morewidth = $("#horizontal-menu-container .more").outerWidth(true)
  $("#horizontal-menu-container > li:not(.more)").each(function() {
    navwidth += $(this).outerWidth(true)
  })
  var availablespace = $("#horizontal-menu").outerWidth(true) - morewidth

  if (navwidth > availablespace) {
    var lastItem = $("#horizontal-menu-container > li:not(.more)").last()
    lastItem.attr("data-width", lastItem.outerWidth(true))
    lastItem.prependTo($("#horizontal-menu-container .more ul"))
    calcHorizontalMenuWidth()
  } else {
    var firstMoreElement = $("#horizontal-menu-container li.more li").first()
    if (navwidth + firstMoreElement.data("width") < availablespace) {
      firstMoreElement.insertBefore($("#horizontal-menu-container .more"))
    }
  }

  if ($(".more li").length > 0) {
    $(".more").css("display", "inline-block")
  } else {
    $(".more").css("display", "none")
  }
}
