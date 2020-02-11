using System;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Xml.Linq;

namespace viDesktop
{
	public partial class MainV2 : System.Web.UI.MasterPage
	{
		const int			MaxAliases			= 250;
		protected	string	sPageID				= "-1";
		protected	int		nApplicationCount	= 0;
		protected	int		nBreadcrumbCount	= 0;
		protected string[,] sFunctionalAreas	= new string [16, 4]{ { "Und", "Undefined", "", "vi vi-triangle-down vi-hc-fw"}
																	, { "Adm", "Admin", "", "vi vi-triangle-down vi-hc-fw"}
																	, { "Bmk", "Benchmarks", "viDesktopEndUserBMKTabName", "vi vi-case vi-hc-fw"}
																	, { "Utl", "Utilize", "viDesktopEndUserUTLTabName", "vi vi-toys vi-hc-fw"}
																	, { "Pmg", "Eval", "viDesktopEndUserEVTabName", "vi vi-assignment-check vi-hc-fw"}
																	, { "Ard", "Attrition Dashboard", "viDesktopEndUserARDTabName", "vi vi-chart-donut vi-hc-fw"}
																	, { "SV", "Survey", "viDesktopEndUserSVTabName", "vi vi-collection-text vi-hc-fw"}
																	, { "Rtf", "Real-Time Feedback", "viDesktopEndUserRTFTabName", "vi vi-comment-more vi-hc-fw"}
																	, { "Int", "Employee Integration", "viDesktopEndUserINTTabName", "vi vi-puzzle-piece vi-hc-fw"}
																	, { "Trn", "Training", "viDesktopEndUserTRTabName", "vi vi-graduation-cap vi-hc-fw"}
																	, { "RE", "Recruit", "viDesktopEndUserRETabName", "vi vi-pin-account vi-hc-fw"}
																	, { "WA", "Work Allocation", "viDesktopEndUserWATabName", "vi vi-arrow-split vi-hc-fw"}
																	, { "Frm", "Form Path", "viDesktopEndUserFPTabName", "vi vi-storage vi-hc-fw"}
																	, { "DB", "Dashboard", "viDesktopEndUserDBTabName", "vi vi-view-dashboard vi-hc-fw"}
																	, { "Emp", "People", "", "vi vi-accounts vi-hc-fw"}
																	, { "Cfg", "Configuration", "", "vi vi-wrench vi-hc-fw"} };

		protected void Page_Load(object sender, System.EventArgs e)
		{
			if(Request["Print"] == "1")
			{
				textBoxDisableSiteNav.Text	= "1";
				textBoxDisableLeftNav.Text	= "1";

				DisplaySiteNav(false, false);
			}
			else 
			{
				if(this.IsPostBack && !ScriptManager.GetCurrent(this.Page).IsInAsyncPostBack && (textBoxLeftNavElementTop.Text != "" || textBoxLeftNavElementBtm.Text != "" || textBoxLeftNavFile.Text != "" || textBoxLeftNavRecentPrc.Text != ""))
					AddLeftSideNav(textBoxProcessID.Text, textBoxProcessName.Text, textBoxLeftNavElementTop.Text, textBoxLeftNavFile.Text, textBoxLeftNavElementBtm.Text, textBoxLeftNavRecentPrc.Text, textBoxLeftNavUserAccessList.Text, textBoxProccessAliases.Text, textBoxLeftNavVariables.Text);
			} //end if

            string ajaxWebFormsScriptHack = "hackEventWithinDoPostBack();";
            ScriptManager.RegisterStartupScript(this, this.GetType(), "ajaxWebFormsScriptHack", ajaxWebFormsScriptHack, true);
        }

		public string AlertsModule { set; get; }

		protected string GetFocusJavascript()
		{
			string sFocusJavascript	= "";

			if(textBoxFocusObjClientID.Text != "")
			{
				sFocusJavascript				= "";
				sFocusJavascript			   += "if($(window).height() - 100 < $(\"#" + textBoxFocusObjClientID.Text + "\").offset().top)";
				sFocusJavascript			   += "window.scroll(0, $(\"#" + textBoxFocusObjClientID.Text + "\").position().top);";
				sFocusJavascript			   += "$(\"#" + textBoxFocusObjClientID.Text + "\").focus();";
				sFocusJavascript			   += "try {$(\"#" + textBoxFocusObjClientID.Text + "\").prop({ selectionStart: 0, selectionEnd: 0}); } catch(err) {}";
				textBoxFocusObjClientID.Text	= "";
			} //end if

			return sFocusJavascript;
		}

		protected void GetFunctionalAreaDisplay(string sFindFunctionalAreaID, ref string sFunctionalAreaID, ref string sFunctionalAreaName, ref string sFunctionalAreaIcon)
		{
			GetFunctionalAreaDisplay(sFindFunctionalAreaID, ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, null);
		}

		protected void GetFunctionalAreaDisplay(string sFindFunctionalAreaID, ref string sFunctionalAreaID, ref string sFunctionalAreaName, ref string sFunctionalAreaIcon, string sFunctionalAreaPostfix)
		{
			sFunctionalAreaName		= "undefined";
			sFunctionalAreaIcon		= "undefined";

			for(int i = 0; i <= sFunctionalAreas.Length / 4 - 1; i++)
			{
				if(sFunctionalAreas[i, 0] == sFindFunctionalAreaID)
				{
					sFunctionalAreaID		= sFindFunctionalAreaID;
					sFunctionalAreaName		= sFunctionalAreas[i, 2] == ""? sFunctionalAreas[i, 1]: Application[sFunctionalAreas[i, 2]].ToString();
					sFunctionalAreaIcon		= sFunctionalAreas[i, 3];
					break;
				} //end if
			} //end if

			sFunctionalAreaName	+= (sFunctionalAreaPostfix == null? "": " - ") + sFunctionalAreaPostfix;
		}

		protected void InitCurrentModuleFunctionalAreaAndUserType()
		{
			string sFilePath				= Request.FilePath.ToLower().Replace("\\", "/");
			string sFunctionalAreaID		= "";
			string sFunctionalAreaName		= "";
			string sFunctionalAreaIcon		= "";

			textBoxUserType.Text			= "Undefined";
			textBoxModuleName.Text			= "Undefined";

			GetFunctionalAreaDisplay("Und", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);

			if(sFilePath.IndexOf("/Admin/", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "Admin";
				textBoxModuleName.Text			= "Admin";
				
				GetFunctionalAreaDisplay("Adm", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);

				if(sFilePath.IndexOf("/Admin/Bmk", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Bmk", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				} 
				else if(sFilePath.IndexOf("/Admin/Cfg", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Cfg", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/DB", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("DB", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Emp", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Emp", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Pmg", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Evl", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Rtf", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Rtf", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Ard", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Ard", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Frm", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Frm", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Int", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Int", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/RE", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("RE", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/SV", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("SV", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Trn", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Trn", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/Utl", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("Utl", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				}
				else if(sFilePath.IndexOf("/Admin/WA", StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					GetFunctionalAreaDisplay("WA", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon, "Admin");
				} //end if
			}
			else if(sFilePath.IndexOf("/viDashboard/", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viDashboard";

				GetFunctionalAreaDisplay("DB", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viEvalAnonymous", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "AnonymousUser";
				textBoxModuleName.Text			= "viEvalAnonymous";

				GetFunctionalAreaDisplay("Evl", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viEval", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viEval";

				GetFunctionalAreaDisplay("Evl", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viForm", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viForm";

				GetFunctionalAreaDisplay("Frm", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viRecruit", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viDashboard";

				GetFunctionalAreaDisplay("DB", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viIntegration", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viIntegration";

				GetFunctionalAreaDisplay("Int", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viRealtimeFeedback", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viRealtimeFeedback";

				GetFunctionalAreaDisplay("Rtf", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viPerformanceMgmt", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viPerformanceMgmt";

				GetFunctionalAreaDisplay("Pmg", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if (sFilePath.IndexOf("/viARDashboard", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viARDashboard";

				GetFunctionalAreaDisplay("Ard", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viSkills", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viSkills";

				GetFunctionalAreaDisplay("Utl", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viSurvey", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "AnonymousUser";
				textBoxModuleName.Text			= "viSurvey";

				GetFunctionalAreaDisplay("SV", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viSurveyEx", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "AnonymousUser";
				textBoxModuleName.Text			= "viSurveyEx";

				GetFunctionalAreaDisplay("SV", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viTraining", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viTraining";

				GetFunctionalAreaDisplay("Trn", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viTrainingEx", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "ExternalUser";
				textBoxModuleName.Text			= "viTraining";

				GetFunctionalAreaDisplay("Trn", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viUtilize", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viUtilize";

				GetFunctionalAreaDisplay("Utl", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			}
			else if(sFilePath.IndexOf("/viWorkAllocation", StringComparison.CurrentCultureIgnoreCase) >= 0)
			{
				textBoxUserType.Text			= "InternalUser";
				textBoxModuleName.Text			= "viWorkAllocation";

				GetFunctionalAreaDisplay("WA", ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);
			} //end if

			textBoxFunctionalAreaID.Text	= sFunctionalAreaID;
			labelFunctionalAreaName.Text	= "<i class=\"" + sFunctionalAreaIcon + "\"></i> " + sFunctionalAreaName;
			textBoxFunctionalAreaIcon.Text	= sFunctionalAreaIcon;
		}

		public string GetCurrentPageName() 
		{ 
			string sPath	= HttpContext.Current.Request.Url.AbsolutePath; 
			FileInfo oInfo	= new FileInfo(sPath); 
			
			return oInfo.Name; 
		} 

		public string GetCurrentPagePath() 
		{ 
			string sPath	= HttpContext.Current.Request.Url.AbsolutePath; 
			FileInfo oInfo	= new FileInfo(sPath); 
			
			return sPath.Substring(0, sPath.Length - oInfo.Name.Length);
		} 

		protected string GetXElementAttribute(XElement element, string sAttribute, string sNotFoundValue)
		{
			try 
			{
				return element.Attribute(sAttribute).Value;
			} 
			catch(Exception)
			{
				return sNotFoundValue;
			} //end try
		}

		protected bool IsLeftNavElementActive(ref string sNavigateUrl, ref string sCurrentPageName, ref string sRelatedPagesPrefix, ref string sOtherRelatedPages, ref string sExcludeRelatedPages, ref string sSelectIfUrlContains) 
		{
			string[] arrRelatedPagesPrefixList	= sRelatedPagesPrefix.Split(',');
			string[] arrOtherRelatedPagesList	= sOtherRelatedPages.Split(',');
			string[] arrExcludeRelatedPagesList	= sExcludeRelatedPages.Split(',');
		
			if(sNavigateUrl != null && sNavigateUrl != "" && sNavigateUrl.IndexOf(sCurrentPageName, StringComparison.CurrentCultureIgnoreCase) >= 0)		
			{
				if(sSelectIfUrlContains != null && sSelectIfUrlContains != "")
				{
					if(Request.Url.AbsoluteUri.IndexOf(sSelectIfUrlContains, StringComparison.CurrentCultureIgnoreCase) < 0)
						return false;

					string[] sQueryStringItems	= Request.Url.AbsoluteUri.Replace("?", "|").Replace("&", "|").Split('|');

					foreach(string sBuffer in sQueryStringItems)
					{
						if(sBuffer.ToLower() == sSelectIfUrlContains.ToLower())
							return true;
					} //end foreach

					return false;
				} //end if

				return true;
			} //end if
			
			for(int a = 0; a <= arrExcludeRelatedPagesList.Length - 1; a++)
			{
				if(arrExcludeRelatedPagesList[a] != null && arrExcludeRelatedPagesList[a] != "" && sCurrentPageName.IndexOf(arrExcludeRelatedPagesList[a], StringComparison.CurrentCultureIgnoreCase) >= 0)
					return false;
			} //end for
			
			for(int a = 0; a <= arrRelatedPagesPrefixList.Length - 1; a++)
			{
				if(arrRelatedPagesPrefixList[a] != null && arrRelatedPagesPrefixList[a] != "" && sCurrentPageName.IndexOf(arrRelatedPagesPrefixList[a], StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					if(sSelectIfUrlContains != null && sSelectIfUrlContains != "")
					{
						if(Request.Url.AbsoluteUri.IndexOf(sSelectIfUrlContains, StringComparison.CurrentCultureIgnoreCase) < 0)
							return false;

						string[] sQueryStringItems	= Request.Url.AbsoluteUri.Replace("?", "|").Replace("&", "|").Split('|');

						foreach(string sBuffer in sQueryStringItems)
						{
							if(sBuffer.ToLower() == sSelectIfUrlContains.ToLower())
								return true;
						} //end foreach

						return false;
					} //end if

					return true;				
				} //end if
			} //end for

			for(int a = 0; a <= arrOtherRelatedPagesList.Length - 1; a++)
			{
				if(arrOtherRelatedPagesList[a] != null && arrOtherRelatedPagesList[a] != "" && arrOtherRelatedPagesList[a].IndexOf(sCurrentPageName, StringComparison.CurrentCultureIgnoreCase) >= 0)
				{
					if(sSelectIfUrlContains != null && sSelectIfUrlContains != "")
					{
						if(Request.Url.AbsoluteUri.IndexOf(sSelectIfUrlContains, StringComparison.CurrentCultureIgnoreCase) < 0)
							return false;

						string[] sQueryStringItems	= Request.Url.AbsoluteUri.Replace("?", "|").Replace("&", "|").Split('|');

						foreach(string sBuffer in sQueryStringItems)
						{
							if(sBuffer.ToLower() == sSelectIfUrlContains.ToLower())
								return true;
						} //end foreach

						return false;
					} //end if

					return true;				
				}
			} //end for

			return false;
		}

		protected int DisplayLeftNav(string sCompanyID, string sUserRef, string sProcessID, string sProcessName, ref string sXMLDocument, string sUserAccessList, string sProcessAliases, string sVariables)
		{
			XDocument xdLeftNav						= XDocument.Parse(sXMLDocument);
			DataTable dataTableGroup				= new DataTable();
			DataColumn dataColGroupText				= new DataColumn();
			DataColumn dataColGroupIcon				= new DataColumn();
			DataColumn dataColGroupLine				= new DataColumn();
            DataColumn dataColNavigateUrl			= new DataColumn();
			DataColumn dataColRelatedPagesPrefix	= new DataColumn();
			DataColumn dataColOtherRelatedPages		= new DataColumn();
			DataColumn dataColExcludeRelatedPages	= new DataColumn();
			DataColumn dataColSelectIfUrlContains	= new DataColumn();
			DataColumn dataColGroupAccess			= new DataColumn();
			DataColumn dataColGroupSection			= new DataColumn();
			DataColumn dataColGroupID				= new DataColumn();
			DataColumn dataColGroupElement			= new DataColumn();
			DataColumn dataColGroupDialog			= new DataColumn();
			DataColumn dataColGroupDialogCss		= new DataColumn();
			string sCurrentPageName					= GetCurrentPageName();
			string sSetActiveElmentID				= divSiteLeftSidebar.Attributes["activeID"] == null? "": divSiteLeftSidebar.Attributes["activeID"];
			bool bActiveElementFound				= false;
			string[,] arrayAliases					= new string[MaxAliases, 2];
			bool bRecentlyViewed					= false;
			string sLastSectionName					= "__undefined__";
			bool bDisplayGroup						= true;
			string sGroupAccessList					= "";
			string sAccess							= "";
			bool bAddSubtitle						= true;
			int nElement1Count						= 0;
			string sText							= "";
			string sNavigateUrl						= "";
			string sTarget							= "";
			string sRelatedPagesPrefix				= "";
			string sOtherRelatedPages				= "";
			string sExcludeRelatedPages				= "";
			string sSelectIfUrlContains				= "";
			string sInnerHtml						= "";
			int nElement2Count						= 0;
			int nElementActive						= 0;
			string sText2							= "";
			string sNavigateUrl2					= "";
			string sTarget2							= "";
			string sRelatedPagesPrefix2				= "";
			string sOtherRelatedPages2				= "";
			string sExcludeRelatedPages2				= "";
			string sSelectIfUrlContains2			= "";
			string sSubtitle						= "";
										
			if(sProcessAliases.IndexOf("{Count}") >= 0)
			{
				int nIndex	= 0;
				int nCount	= Convert.ToInt32(GetSubstring(sProcessAliases, 0, "{Count}", "{/Count}", ref nIndex));

				for(int i = 0; i <= nCount - 1; i++)
				{
					string sTemp		= GetSubstring(sProcessAliases, 0, "{" + i.ToString() + "}", "{/" + i.ToString() + "}", ref nIndex);
					arrayAliases[i, 0]	= GetSubstring(sTemp, 0, "{", "}", ref nIndex);
					arrayAliases[i, 1]	= GetSubstring(sTemp, 0, "{" + arrayAliases[i, 0] + "}", "{/" + arrayAliases[i, 0] + "}", ref nIndex);
				} //end if
			} //end if

            dataColGroupText.DataType				= System.Type.GetType("System.String");
            dataColGroupText.ColumnName				= "Text";
            dataTableGroup.Columns.Add(dataColGroupText);

            dataColGroupIcon.DataType				= System.Type.GetType("System.String");
            dataColGroupIcon.ColumnName				= "Icon";
            dataTableGroup.Columns.Add(dataColGroupIcon);

            dataColGroupLine.DataType				= System.Type.GetType("System.String");
            dataColGroupLine.ColumnName				= "Line";
            dataTableGroup.Columns.Add(dataColGroupLine);

            dataColNavigateUrl.DataType				= System.Type.GetType("System.String");
            dataColNavigateUrl.ColumnName			= "NavigateUrl";
            dataTableGroup.Columns.Add(dataColNavigateUrl);

            dataColRelatedPagesPrefix.DataType		= System.Type.GetType("System.String");
            dataColRelatedPagesPrefix.ColumnName	= "RelatedPagesPrefix";
            dataTableGroup.Columns.Add(dataColRelatedPagesPrefix);

            dataColOtherRelatedPages.DataType		= System.Type.GetType("System.String");
            dataColOtherRelatedPages.ColumnName		= "OtherRelatedPages";
            dataTableGroup.Columns.Add(dataColOtherRelatedPages);
			
            dataColExcludeRelatedPages.DataType		= System.Type.GetType("System.String");
            dataColExcludeRelatedPages.ColumnName	= "ExcludeRelatedPages";
            dataTableGroup.Columns.Add(dataColExcludeRelatedPages);

            dataColSelectIfUrlContains.DataType		= System.Type.GetType("System.String");
            dataColSelectIfUrlContains.ColumnName	= "SelectIfUrlContains";
            dataTableGroup.Columns.Add(dataColSelectIfUrlContains);

            dataColGroupAccess.DataType				= System.Type.GetType("System.String");
            dataColGroupAccess.ColumnName			= "Access";
            dataTableGroup.Columns.Add(dataColGroupAccess);

            dataColGroupSection.DataType			= System.Type.GetType("System.String");
            dataColGroupSection.ColumnName			= "Section";
            dataTableGroup.Columns.Add(dataColGroupSection);

            dataColGroupID.DataType					= System.Type.GetType("System.String");
            dataColGroupID.ColumnName				= "ID";
            dataTableGroup.Columns.Add(dataColGroupID);

            dataColGroupDialog.DataType				= System.Type.GetType("System.String");
            dataColGroupDialog.ColumnName			= "Dialog";
            dataTableGroup.Columns.Add(dataColGroupDialog);

            dataColGroupDialogCss.DataType			= System.Type.GetType("System.String");
            dataColGroupDialogCss.ColumnName		= "DialogCss";
            dataTableGroup.Columns.Add(dataColGroupDialogCss);
			
            dataColGroupElement.DataType			= System.Type.GetType("System.String");
            dataColGroupElement.ColumnName			= "Element";
            dataTableGroup.Columns.Add(dataColGroupElement);

			foreach(XElement element in xdLeftNav.Root.Elements("siteMapGroup"))
			{
				DataRow row					= dataTableGroup.NewRow();
				bDisplayGroup				= true;
				sGroupAccessList			= GetXElementAttribute(element, "Access", "");

				if(sGroupAccessList != "")
				{
					string[] arrGroupAccessList	= sGroupAccessList.Split(',');

					bDisplayGroup			= false;

					for(int a = 0; a <= arrGroupAccessList.Length - 1; a++)
					{
						if(sUserAccessList.IndexOf(arrGroupAccessList[a]) >= 0 || sUserAccessList == "*")
						{
							bDisplayGroup	= true;
							break;
						} //end if
					} //end for
				} //end if

				if(bDisplayGroup)
				{
					row["Text"]					= GetXElementAttribute(element, "Text", "Text not found");
					row["Icon"]					= GetXElementAttribute(element, "Icon", "");
					row["Line"]					= GetXElementAttribute(element, "Line", "");
					row["NavigateUrl"]			= GetXElementAttribute(element, "NavigateUrl", "#");
					row["RelatedPagesPrefix"]	= GetXElementAttribute(element, "RelatedPagesPrefix", "");
					row["OtherRelatedPages"]	= GetXElementAttribute(element, "OtherRelatedPages", "");
					row["ExcludeRelatedPages"]	= GetXElementAttribute(element, "ExcludeRelatedPages", "");
					row["SelectIfUrlContains"]	= GetXElementAttribute(element, "SelectIfUrlContains", "");
					row["Access"]				= GetXElementAttribute(element, "Access", "");
					row["Section"]				= GetXElementAttribute(element, "Section", "");
					row["ID"]					= GetXElementAttribute(element, "ID", "");
					row["Dialog"]				= GetXElementAttribute(element, "Dialog", "");
					row["DialogCss"]			= GetXElementAttribute(element, "DialogCss", "");
					row["Element"]				= element.ToString();
					dataTableGroup.Rows.Add(row);
				} //end if
			} //end foreach

			repeaterMain.DataSource = dataTableGroup;
			repeaterMain.DataBind();

			for(int nGr = 0; nGr <= dataTableGroup.Rows.Count - 1; nGr++)
			{
				Literal literalSection		= ((Literal)repeaterMain.Items[nGr].FindControl("literalSection"));
				Literal literalGroupTop		= ((Literal)repeaterMain.Items[nGr].FindControl("literalGroupTop"));
				Literal	literalGroupBtm		= ((Literal)repeaterMain.Items[nGr].FindControl("literalGroupBtm"));
				HtmlGenericControl divItems = ((HtmlGenericControl)repeaterMain.Items[nGr].FindControl("divItems"));
				HyperLink hyperLinkItem		= ((HyperLink)repeaterMain.Items[nGr].FindControl("hyperLinkItem"));
				Label labelHeader			= ((Label)repeaterMain.Items[nGr].FindControl("labelHeader"));
				HtmlGenericControl ulItems	= ((HtmlGenericControl)repeaterMain.Items[nGr].FindControl("ulItems"));
				XDocument xdLeftNavItem		= XDocument.Load(new StringReader(dataTableGroup.Rows[nGr]["Element"].ToString()));
				sAccess						= dataTableGroup.Rows[nGr]["Access"].ToString();
				bAddSubtitle				= true;
				nElement1Count				= 0;
				
				bRecentlyViewed				= bRecentlyViewed? true: (dataTableGroup.Rows[nGr]["Section"].ToString().IndexOf("Recently Viewed", StringComparison.CurrentCultureIgnoreCase) >= 0? true: false);

				for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++)
					dataTableGroup.Rows[nGr]["Section"]	= dataTableGroup.Rows[nGr]["Section"].ToString().Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);

				if(dataTableGroup.Rows[nGr]["Line"].ToString().IndexOf("True", StringComparison.CurrentCultureIgnoreCase) == 0)
				{
					Literal literalLine		= ((Literal)repeaterMain.Items[nGr].FindControl("literalLine"));
						
					literalLine.Text		= "<li><hr /></li>";
				} //end if

				if(dataTableGroup.Rows[nGr]["Section"].ToString() != "" && dataTableGroup.Rows[nGr]["Section"].ToString() != sLastSectionName)
				{
					literalSection.Text		= "<li class=\"menu-title\">" + dataTableGroup.Rows[nGr]["Section"].ToString().Replace("{ProcessName}", sProcessName) + "</li>";
					sLastSectionName		= dataTableGroup.Rows[nGr]["Section"].ToString();
				} //end if

				foreach(XElement element in xdLeftNavItem.Root.Elements("siteMapItem"))
				{
					HtmlGenericControl li	= new HtmlGenericControl("li");
					sText					= GetXElementAttribute(element, "Text", "Text not found");
					sNavigateUrl			= GetXElementAttribute(element, "NavigateUrl", "Text not found");
					sTarget					= GetXElementAttribute(element, "Target", "");
					sRelatedPagesPrefix		= GetXElementAttribute(element, "RelatedPagesPrefix", "");
					sOtherRelatedPages		= GetXElementAttribute(element, "OtherRelatedPages", "");
					sExcludeRelatedPages	= GetXElementAttribute(element, "ExcludeRelatedPages", "");
					sSelectIfUrlContains	= GetXElementAttribute(element, "SelectIfUrlContains", "");
					sInnerHtml				= "";
					nElement2Count			= 0;
					nElementActive			= 0;

					sNavigateUrl			= sNavigateUrl.ToString().Replace("{CompanyID}", sCompanyID).Replace("{UserRef}", sUserRef).Replace("{ProcessID}", sProcessID);

					for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++) 
					{
						sText					= sText.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
						sNavigateUrl			= sNavigateUrl.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
						sSelectIfUrlContains	= sSelectIfUrlContains.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
					} //end for

					if(bAddSubtitle)
					{
						HtmlGenericControl liSubtitle	= new HtmlGenericControl("li");
						sSubtitle						= dataTableGroup.Rows[nGr]["Text"].ToString();

						for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++)
							sSubtitle	= sSubtitle.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);

						bAddSubtitle					= false;
						liSubtitle.InnerHtml			= sSubtitle;
						liSubtitle.Attributes["class"]	= "menu-subtitle";
						ulItems.Controls.Add(liSubtitle);
					} //end if

					foreach(XElement element2 in element.Elements("siteMapItem"))
					{
						sText2					= GetXElementAttribute(element2, "Text", "Text not found");
						sNavigateUrl2			= GetXElementAttribute(element2, "NavigateUrl", "Text not found");
						sTarget2				= GetXElementAttribute(element2, "Target", "");
						sRelatedPagesPrefix2	= GetXElementAttribute(element2, "RelatedPagesPrefix", "");
						sOtherRelatedPages2		= GetXElementAttribute(element2, "OtherRelatedPages", "");
						sExcludeRelatedPages2	= GetXElementAttribute(element2, "ExcludeRelatedPages", "");
						sSelectIfUrlContains2	= GetXElementAttribute(element2, "SelectIfUrlContains", "");
						
						if(nElement2Count == 0)
						{
							sInnerHtml	+= " <a aria-expanded=\"false\" href=\"#\">";
							sInnerHtml	+= "<span class=\"menu-text\">" + sText + "</span>";
							sInnerHtml	+= "</a>";
							sInnerHtml	+= " <ul class=\"sidebar-submenu collapse\" aria-expanded=\"false\">";
							sInnerHtml	+= " <li class=\"menu-subtitle\">" + sText + "</li>";
						} //end if

						sNavigateUrl2	 = sNavigateUrl2.ToString().Replace("{CompanyID}", sCompanyID).Replace("{UserRef}", sUserRef).Replace("{ProcessID}", sProcessID);

						if(nElementActive == 0 && IsLeftNavElementActive(ref sNavigateUrl2, ref sCurrentPageName, ref sRelatedPagesPrefix2, ref sOtherRelatedPages2, ref sExcludeRelatedPages2, ref sSelectIfUrlContains2))
							nElementActive	= 1;

						for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++)
						{
							sText2					= sText2.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
							sNavigateUrl2			= sNavigateUrl2.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
							sSelectIfUrlContains2	= sSelectIfUrlContains2.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
						} //end for
						
						sInnerHtml		+= "<li" + (sNavigateUrl2.IndexOf(sCurrentPageName, StringComparison.CurrentCultureIgnoreCase) >= 0? " class=\"active\"": "") + ">";
						sInnerHtml		+= "<a href=\"" + sNavigateUrl2 + "\"" + (sTarget2 == ""? "": " target=" + sTarget2) + ">" + sText2 + "</a>";
						sInnerHtml		+= "</li>";
						nElement2Count++;
					} //end foreach

					if(nElement2Count > 0)
					{
						sInnerHtml		+= "</ul>";

						li.InnerHtml			= sInnerHtml;
						li.Attributes["class"]	= "with-sub" + (nElementActive == 1? " open active": "");
						ulItems.Controls.Add(li);
					}
					else
					{
						if(IsLeftNavElementActive(ref sNavigateUrl, ref sCurrentPageName, ref sRelatedPagesPrefix, ref sOtherRelatedPages, ref sExcludeRelatedPages, ref sSelectIfUrlContains))
							li.Attributes["class"]	= "open active";

						li.InnerHtml			= "<a href=\"" + sNavigateUrl + "\"" + (sTarget == ""? "": " target=" + sTarget) + ">" + sText + "</a>";				
						ulItems.Controls.Add(li);
					} //end if

					if(li.Attributes["class"] != null && li.Attributes["class"].IndexOf("active") >= 0)
					{
						literalGroupTop.Text		= "<li class=\"with-sub open active\">";
						ulItems.Attributes["class"]	= "sidebar-submenu collapse in";
					} //end if

					nElement1Count++;
				} //end foreach

				labelHeader.Text			= dataTableGroup.Rows[nGr]["Text"].ToString();

				for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++)
					labelHeader.Text		= labelHeader.Text.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);

				if(!String.IsNullOrEmpty(dataTableGroup.Rows[nGr]["ID"].ToString()))
				{
					Label labelAlert			= ((Label)repeaterMain.Items[nGr].FindControl("labelAlert"));
					string sID					= dataTableGroup.Rows[nGr]["ID"].ToString();

					if(String.IsNullOrEmpty(sVariables))
					{
						string sAlertText			= GetSubstring(sVariables, 0, "{" + sID + "-AlertText}", "{/" + sID + "-AlertText}");
						string sAlertClass			= GetSubstring(sVariables, 0, "{" + sID + "-AlertClass}", "{/" + sID + "-AlertClass}");

						if(!String.IsNullOrEmpty(sAlertText))
						{
							labelAlert.Text				= sAlertText;
							labelAlert.CssClass			= labelAlert.CssClass.Replace(" hidden", "");
						} //end if

						if(!String.IsNullOrEmpty(sAlertClass))
						{
							labelAlert.CssClass			= sAlertClass;
						} //end if
					} //end if

					labelAlert.Attributes.Add("left-nav-alert", sID);
				} //end if

				if(dataTableGroup.Rows[nGr]["Icon"].ToString() != "") 
				{
					Label labelIcon			= ((Label)repeaterMain.Items[nGr].FindControl("labelIcon"));

					labelIcon.Text			= "<i class=\"" + dataTableGroup.Rows[nGr]["Icon"].ToString() + "\"></i>";
				} //end if

				if(nElement1Count == 0)
				{
					sNavigateUrl				= dataTableGroup.Rows[nGr]["NavigateUrl"] != DBNull.Value? dataTableGroup.Rows[nGr]["NavigateUrl"].ToString(): "";
					sRelatedPagesPrefix			= dataTableGroup.Rows[nGr]["RelatedPagesPrefix"] != DBNull.Value? dataTableGroup.Rows[nGr]["RelatedPagesPrefix"].ToString(): "";
					sOtherRelatedPages			= dataTableGroup.Rows[nGr]["OtherRelatedPages"] != DBNull.Value? dataTableGroup.Rows[nGr]["OtherRelatedPages"].ToString(): "";
					sExcludeRelatedPages		= dataTableGroup.Rows[nGr]["ExcludeRelatedPages"] != DBNull.Value? dataTableGroup.Rows[nGr]["ExcludeRelatedPages"].ToString(): "";
					sSelectIfUrlContains		= dataTableGroup.Rows[nGr]["SelectIfUrlContains"] != DBNull.Value? dataTableGroup.Rows[nGr]["SelectIfUrlContains"].ToString(): "";

					for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++) 
					{
						sNavigateUrl			= sNavigateUrl.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
						sSelectIfUrlContains	= sSelectIfUrlContains.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);
					} //end for

					literalGroupTop.Text		= "<li>";

					if(bRecentlyViewed)
					{
						literalGroupTop.Text	= "<li class=\"recently-viewed\">";
					} //end if

					if(sSetActiveElmentID != "" && !bActiveElementFound && dataTableGroup.Rows[nGr]["ID"].ToString() == sSetActiveElmentID)
					{
						literalGroupTop.Text	= "<li class=\"active\">";
						bActiveElementFound		= true;
					} //end if

					if(sSetActiveElmentID == "" && !bActiveElementFound && IsLeftNavElementActive(ref sNavigateUrl, ref sCurrentPageName, ref sRelatedPagesPrefix, ref sOtherRelatedPages, ref sExcludeRelatedPages, ref sSelectIfUrlContains))
					{
						literalGroupTop.Text	= "<li class=\"active\">";
						bActiveElementFound		= true;
					} //end if

					literalGroupBtm.Text		= "</li>";
					ulItems.Visible				= false;

					if(sNavigateUrl != "")
					{ 
						sNavigateUrl	= sNavigateUrl.Replace("{CompanyID}", sCompanyID).Replace("{UserRef}", sUserRef).Replace("{ProcessID}", sProcessID);

						for(int a = 0; a <= MaxAliases - 1 && arrayAliases[a, 0] != null; a++)
							sNavigateUrl		= sNavigateUrl.Replace("{" + arrayAliases[a, 0] + "}", arrayAliases[a, 1]);

						if(dataTableGroup.Rows[nGr]["Dialog"] != DBNull.Value && dataTableGroup.Rows[nGr]["Dialog"].ToString().IndexOf("True", StringComparison.CurrentCultureIgnoreCase) == 0)
						{ 
							hyperLinkItem.NavigateUrl	= "#";

							hyperLinkItem.Attributes.Add("onclick", "$('#" + hyperLinkItem.ClientID + "').openDialog(); return false;");
							hyperLinkItem.Attributes.Add("dialog-url", sNavigateUrl);

							if(dataTableGroup.Rows[nGr]["DialogCss"] != DBNull.Value)
								hyperLinkItem.Attributes.Add("dialog-additional-css", dataTableGroup.Rows[nGr]["DialogCss"].ToString());
						}
						else
						{ 
							string sCurrentPagePath	= GetCurrentPagePath();

							hyperLinkItem.NavigateUrl	= sNavigateUrl.StartsWith(sCurrentPagePath, StringComparison.CurrentCultureIgnoreCase)? sNavigateUrl: sCurrentPagePath + sNavigateUrl;
							hyperLinkItem.Attributes.Add("data-toggle", "tooltip");
							hyperLinkItem.Attributes.Add("data-placement", "right");
							hyperLinkItem.Attributes.Add("data-original-title", labelHeader.Text);
						} //end if
					} //end if
				}
				else
				{
					literalGroupTop.Text		= "<li class=\"with-sub\">";
					literalGroupTop.Text	   += "<div class=\"triangle\"></div>";
					literalGroupBtm.Text		= "</li>";
				} //end if
			} //end for

			return dataTableGroup.Rows.Count;
		}

		public string GetSubstring(string Expression, int nStartIndex, string StartString, string EndString)
		{
			int nEndIndex	= 0;

			return GetSubstring(Expression, nStartIndex, StartString, EndString, ref nEndIndex);
		}

		public string GetSubstring(string Expression, int nStartIndex, string StartString, string EndString, ref int nEndIndex)
		{
			int nStartStringIndex	= -1;
			int nEndStringIndex		= -1;

			if (Expression == null)
				return null;

			nStartStringIndex = Expression.IndexOf(StartString, nStartIndex);
			if (nStartStringIndex < 0)
				return null;

			nEndStringIndex = Expression.Substring(nStartStringIndex + StartString.Length).IndexOf(EndString);
			if (nEndStringIndex < 0)
				return null;

			nEndIndex = nStartStringIndex + StartString.Length + nEndStringIndex + EndString.Length;

			return Expression.Substring(nStartStringIndex + StartString.Length, nEndStringIndex);
		}

		public void InitMasterPage(string sCompanyID, string sUserRef, string sUserName, string sCompanyName, string sLogoUrl, string sLogoBgBlendMode, string sLogoPadding
									, bool bIsLoginUserAuthenticated, bool bDisplaySignOff, bool bAllowChangePassword, bool bAllowSavePassword, bool bSavePasswordIsOn)
		{
			InitCurrentModuleFunctionalAreaAndUserType();

			textBoxCompanyID.Text				= sCompanyID;
			textBoxUserRef.Text					= sUserRef;
			labelUserName.Text					= sUserName == "Default Admin Account" || sUserName == "Admin, System"? "Admin": (sUserName == "Survey Login Account"? "Survey": sUserName);
			textBoxLogoUrl.Text					= sLogoUrl.Trim();
			textBoxLogoBgBlendMode.Text			= sLogoBgBlendMode == ""? "multiply": sLogoBgBlendMode;
			textBoxLogoPadding.Text				= sLogoPadding == ""? "0": sLogoPadding;
			labelCompanyName.Text				= Application["PageTopCompanyLogoDisplay"] != null && Application["PageTopCompanyLogoDisplay"].ToString() == "1" && textBoxLogoUrl.Text != ""? "": sCompanyName;
			labelCompanyName.CssClass			= Application["PageTopCompanyLogoDisplay"] != null && Application["PageTopCompanyLogoDisplay"].ToString() == "1" && textBoxLogoUrl.Text != ""? "logo-image": "logo-text";
			textBoxAllowChangePassword.Text		= bAllowChangePassword || textBoxUserType.Text == "Admin"? "1": "0";
			textBoxDisableSiteNav.Text			= textBoxModuleName.Text == "Undefined"? "1": textBoxDisableSiteNav.Text;
			divSiteTopNav.Visible				= textBoxDisableSiteNav.Text == "1"? false: true;
			divSiteLeftSidebar.Visible			= textBoxDisableSiteNav.Text == "1" || textBoxDisableLeftNav.Text == "1" || textBoxModuleName.Text == "Undefined" || textBoxLeftNavItemCount.Text == "0"? false: true;
			buttonApplicationsSM.Visible		= false;
			buttonApplicationsXS.Visible		= false;
			aPeople.Visible						= false;
			aConfiguration.Visible				= false;
			hyperLinkSavePwdOnSM.Visible		= false;
			hyperLinkSavePwdOnXS.Visible		= false;
			hyperLinkSavePwdOffSM.Visible		= false;
			hyperLinkSavePwdOffXS.Visible		= false;
			hyperLinkSupportSM.Visible			= false;
			hyperLinkSupportXS.Visible			= false;
			hyperLinkSignOffSM.Visible			= false;
			hyperLinkSignOffXS.Visible			= false;

			hyperLinkSavePwdOnSM.NavigateUrl	= "~/Common/SavePassword.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;
			hyperLinkSavePwdOnXS.NavigateUrl	= "~/Common/SavePassword.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;
			hyperLinkSavePwdOffSM.NavigateUrl	= "~/Common/SavePassword.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;
			hyperLinkSavePwdOffXS.NavigateUrl	= "~/Common/SavePassword.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;
			hyperLinkSupportSM.NavigateUrl		= Application["SupportSiteURL"] != null && Application["SupportSiteURL"].ToString().Trim() != ""? Application["SupportSiteURL"].ToString(): "https://Support1.viGlobalcloud.com/viSupportSite/viTrainingEx/login.aspx";
			hyperLinkSupportXS.NavigateUrl		= Application["SupportSiteURL"] != null && Application["SupportSiteURL"].ToString().Trim() != ""? Application["SupportSiteURL"].ToString(): "https://Support1.viGlobalcloud.com/viSupportSite/viTrainingEx/login.aspx";
			hyperLinkSignOffSM.NavigateUrl		= "~/Common/SignOff.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;
			hyperLinkSignOffXS.NavigateUrl		= "~/Common/SignOff.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;

			ApplicationClearAll();

			if(textBoxUserType.Text == "Admin")
			{
				aPeople.HRef					= "~/Admin/EmpDefault.aspx?CompanyID="+ textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;
				aConfiguration.HRef				= "~/Admin/CfgDefault.aspx?CompanyID="+ textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text;

				ApplicationAdd("Pmg", "~/Admin/PmgDefault.aspx?Module=PMG&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Int", "~/Admin/IntDefault.aspx?Module=DB&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Rtf", "~/Admin/RtfDefault.aspx?Module=RTF&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Ard", "~/Admin/ArdDefault.aspx?Module=ARD&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Trn", "~/Admin/TrnDefault.aspx?Module=TRN&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("WA", "~/Admin/WADefault.aspx?Module=WA&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("RE", "~/Admin/REDefault.aspx?Module=RE&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Bmk", "~/Admin/BmkDefault.aspx?Module=BMK&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Utl", "~/Admin/UtlDefault.aspx?Module=UTL&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("Frm", "~/Admin/FrmDefault.aspx?Module=FRM&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("DB", "~/Admin/DBDefault.aspx?Module=DB&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				ApplicationAdd("SV", "~/Admin/SVDefault.aspx?Module=EVL&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);

				buttonApplicationsSM.Visible	= true;
				buttonApplicationsXS.Visible	= true;
				aPeople.Visible					= true;
				aConfiguration.Visible			= true;
				hyperLinkSupportSM.Visible		= true;
				hyperLinkSupportXS.Visible		= true;
				hyperLinkSignOffSM.Visible		= true;
				hyperLinkSignOffXS.Visible		= true;
				
				literalBreadcrumbA.Text			= "";
				literalBreadcrumbA.Text		   += "<a class=\"btn btn-apps\" href='AppDefault.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text + "'><i class=\"vi vi-apps vi-hc-fw\"></i></a>";

				if(!(textBoxFunctionalAreaID.Text == "undefined" || textBoxFunctionalAreaID.Text == "Adm" ||  textBoxFunctionalAreaID.Text == "Cfg"))
				{
					literalBreadcrumbP.Text			= "";
					literalBreadcrumbP.Text		   += "<a class=\"btn btn-default" + (literalBreadcrumb0.Text == ""? " btn-active": "") + "\" href='" + textBoxFunctionalAreaID.Text + "Default.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text + "'>Manage " + (textBoxFunctionalAreaID.Text == "Ard"? "Dashboards": "Processes") + "</a>";
				} //end if
			}
			else if(textBoxUserType.Text == "ExternalUser")
			{
				if(Application["viDesktopEndUserDisplayTRTab"] != null && Application["viDesktopEndUserDisplayTRTab"].ToString() == "1")
					ApplicationAdd("Trn", "~/UserRedir.aspx?Module=TRN&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
			}
			else if(textBoxUserType.Text == "InternalUser")
			{
				if(Application["viDesktopEndUserDisplayEVTab"] != null && Application["viDesktopEndUserDisplayEVTab"].ToString() == "1")
					ApplicationAdd("Pmg", "~/UserRedir.aspx?Module=PMG&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if (Application["viDesktopEndUserDisplayRTFTab"] != null && Application["viDesktopEndUserDisplayRTFTab"].ToString() == "1")
					ApplicationAdd("Rtf", "~/UserRedir.aspx?Module=RTF&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if(Application["viDesktopEndUserDisplayINTTab"] != null && Application["viDesktopEndUserDisplayINTTab"].ToString() == "1")
					ApplicationAdd("Int", "~/UserRedir.aspx?Module=INT&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if (Application["viDesktopEndUserDisplayARDTab"] != null && Application["viDesktopEndUserDisplayARDTab"].ToString() == "1")
					ApplicationAdd("Ard", "~/UserRedir.aspx?Module=ARD&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if(Application["viDesktopEndUserDisplayTRTab"] != null && Application["viDesktopEndUserDisplayTRTab"].ToString() == "1")
					ApplicationAdd("Trn", "~/UserRedir.aspx?Module=TRN&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if(Application["viDesktopEndUserDisplayWATab"] != null && Application["viDesktopEndUserDisplayWATab"].ToString() == "1")
					ApplicationAdd("WA", "~/UserRedir.aspx?Module=WA&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if(Application["viDesktopEndUserDisplayRETab"] != null && Application["viDesktopEndUserDisplayRETab"].ToString() == "1")
					ApplicationAdd("RE", "~/UserRedir.aspx?Module=RE&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if (Application["viDesktopEndUserDisplayBMKTab"] != null && Application["viDesktopEndUserDisplayBMKTab"].ToString() == "1")
					ApplicationAdd("Bmk", "~/UserRedir.aspx?Module=BMK&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if(Application["viDesktopEndUserDisplayUTLTab"] != null && Application["viDesktopEndUserDisplayUTLTab"].ToString() == "1")
					ApplicationAdd("Utl", "~/UserRedir.aspx?Module=UTL&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if(Application["viDesktopEndUserDisplayFPTab"] != null && Application["viDesktopEndUserDisplayFPTab"].ToString() == "1")
					ApplicationAdd("Frm", "~/UserRedir.aspx?Module=FRM&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				if (Application["viDesktopEndUserDisplayDBTab"] != null && Application["viDesktopEndUserDisplayDBTab"].ToString() == "1")
					ApplicationAdd("DB", "~/UserRedir.aspx?Module=DB&CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text);
				
				literalBreadcrumbA.Text			= "";
				literalBreadcrumbA.Text		   += "<a class=\"btn btn-apps hidden\" href='AppDefault.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text + "'><i class=\"vi vi-apps vi-hc-fw\"></i></a>";

				if(!(textBoxFunctionalAreaID.Text == "undefined" || textBoxFunctionalAreaID.Text == "Adm" || textBoxFunctionalAreaID.Text == "Rtf" || textBoxFunctionalAreaID.Text == "Trn"))
				{
					literalBreadcrumbP.Text			= "";
					literalBreadcrumbP.Text		   += "<a class=\"btn btn-default" + (literalBreadcrumb0.Text == ""? " btn-active": "") + "\" href='" + textBoxFunctionalAreaID.Text + "Default.aspx?CompanyID=" + textBoxCompanyID.Text + "&UserRef=" + textBoxUserRef.Text + "&DisplayProcesses=1'>Manage " + (textBoxFunctionalAreaID.Text == "Ard"? "Dashboards": "Processes") + "</a>";
				} //end if
			} //end if
			
			if(nApplicationCount > 1)
			{
				buttonApplicationsSM.Visible		= true;
				buttonApplicationsXS.Visible		= true;
			} //end if

			if (bIsLoginUserAuthenticated)
			{
				if(bDisplaySignOff)
				{
					hyperLinkSignOffSM.Visible		= true;
					hyperLinkSignOffXS.Visible		= true;
				} //end if

				if(bAllowSavePassword)
				{
					hyperLinkSavePwdOnSM.Visible		=  bSavePasswordIsOn;
					hyperLinkSavePwdOnXS.Visible		=  bSavePasswordIsOn;
					hyperLinkSavePwdOffSM.Visible		= !bSavePasswordIsOn;
					hyperLinkSavePwdOffXS.Visible		= !bSavePasswordIsOn;

					if (Application["AuthenticationType"] != null && Convert.ToInt32(Application["AuthenticationType"].ToString()) == (int)__Functions.AuthenticationType.SAML && Request.Url.Port == 443)
					{
						textBoxAllowChangePassword.Text	= "0";
						hyperLinkSavePwdOffSM.Visible	= false;
						hyperLinkSavePwdOffXS.Visible	= false;
					} //end if
				} //end if
			} // end if
		}

		protected void ApplicationClearAll()
		{
			aApplication0.Visible	= false;
			aApplication1.Visible	= false;
			aApplication2.Visible	= false;
			aApplication3.Visible	= false;
			aApplication4.Visible	= false;
			aApplication5.Visible	= false;
			aApplication6.Visible	= false;
			aApplication7.Visible	= false;
			aApplication8.Visible	= false;
			aApplication9.Visible	= false;
			aApplication10.Visible	= false;
			aApplication11.Visible	= false;

			nApplicationCount = 0;
		}

		protected void ApplicationAdd(string sFunctionalAreaID, string sUrl)
		{
			string sFunctionalAreaName		= "";
			string sFunctionalAreaIcon		= "";
			string sInnerHtml				= "";

			GetFunctionalAreaDisplay(sFunctionalAreaID, ref sFunctionalAreaID, ref sFunctionalAreaName, ref sFunctionalAreaIcon);

			sInnerHtml += "<div class=\"ai-icon\"><h3><i class=\"" + sFunctionalAreaIcon  +"\"></i></h3></div>";
			sInnerHtml += "<div class=\"ai-title\">" + sFunctionalAreaName + "</div>";

			switch(nApplicationCount)
			{
				case 0:
					aApplication0.InnerHtml		= sInnerHtml;
					aApplication0.HRef			= sUrl;
					aApplication0.Visible		= true;
					break;
				case 1:
					aApplication1.InnerHtml		= sInnerHtml;
					aApplication1.HRef			= sUrl;
					aApplication1.Visible		= true;
					break;
				case 2:
					aApplication2.InnerHtml		= sInnerHtml;
					aApplication2.HRef			= sUrl;
					aApplication2.Visible		= true;
					break;
				case 3:
					aApplication3.InnerHtml		= sInnerHtml;
					aApplication3.HRef			= sUrl;
					aApplication3.Visible		= true;
					break;
				case 4:
					aApplication4.InnerHtml		= sInnerHtml;
					aApplication4.HRef			= sUrl;
					aApplication4.Visible		= true;
					break;
				case 5:
					aApplication5.InnerHtml		= sInnerHtml;
					aApplication5.HRef			= sUrl;
					aApplication5.Visible		= true;
					break;
				case 6:
					aApplication6.InnerHtml		= sInnerHtml;
					aApplication6.HRef			= sUrl;
					aApplication6.Visible		= true;
					break;
				case 7:
					aApplication7.InnerHtml		= sInnerHtml;
					aApplication7.HRef			= sUrl;
					aApplication7.Visible		= true;
					break;
				case 8:
					aApplication8.InnerHtml		= sInnerHtml;
					aApplication8.HRef			= sUrl;
					aApplication8.Visible		= true;
					break;
				case 9:
					aApplication9.InnerHtml		= sInnerHtml;
					aApplication9.HRef			= sUrl;
					aApplication9.Visible		= true;
					break;
				case 10:
					aApplication10.InnerHtml	= sInnerHtml;
					aApplication10.HRef			= sUrl;
					aApplication10.Visible		= true;
					break;
				case 11:
					aApplication11.InnerHtml	= sInnerHtml;
					aApplication11.HRef			= sUrl;
					aApplication11.Visible		= true;
					break;
			} //end if

			nApplicationCount++;
		}

		public void AddBackUrl(string sNavigateUrl)
		{
			literalBreadcrumbB.Text			= "";
			literalBreadcrumbB.Text		   += "<a class=\"btn btn-default btn-back\" href='" + sNavigateUrl + "'><i class=\"vi vi-long-arrow-left vi-hc-fw\"></i>Back</a>";
			textBoxBackUrl.Text				= sNavigateUrl;
		}

		public void AddBreadcrumb(string sText, string sNavigateUrl, bool bEnabled, bool bVisible)
		{
			string sAliasDashboard = Application["AliasDashboard"] != null? Application["AliasDashboard"].ToString(): "Dashboard";

			if(!bVisible || textBoxDisableSiteNav.Text == "1")
				return;

			if(sText == "Recruit")
				sText = "Recruiting";

			if(sText == "Business Processes")
				sText = Application["viDesktopEndUserFPTabName"].ToString();
			else if(sText == "Utilize")
				sText = Application["viDesktopEndUserUTLTabName"].ToString();
			else if(sText == "Skills")
				sText = Application["viDesktopEndUserBMKTabName"].ToString();
			else if(sText == "Dashboard")
				sText = Application["viDesktopEndUserDBTabName"].ToString();
			else if(sText == "Performance Management")
				sText = Application["viDesktopEndUserEVTabName"].ToString();
			else if(sText == "Recruiting")
				sText = Application["viDesktopEndUserRETabName"].ToString();
			else if(sText == "Survey")
				sText = Application["viDesktopEndUserSVTabName"].ToString();
			else if(sText == "Training")
				sText = Application["viDesktopEndUserTRTabName"].ToString();
			else if(sText == "Work Allocation")
				sText = Application["viDesktopEndUserWATabName"].ToString();
			else if(sText == "Employee Integration")
				sText = Application["viDesktopEndUserINTTabName"].ToString();
			else if(sText == "Real-Time Feedback")
				sText = Application["viDesktopEndUserRTFTabName"].ToString();
			else if(sText == "Attrition Dashboard")
				sText = Application["viDesktopEndUserARDTabName"].ToString();
			
			if(nBreadcrumbCount < 12)
			{
				Literal literalBreadcrumb		= ((Literal)this.FindControl("literalBreadcrumb" + nBreadcrumbCount.ToString()));

				sText	= Regex.Replace(sText, "<.*?>", String.Empty);
				
				if(sText.Length > 30)
					sText	= sText.Substring(0, 30) + "...";

				literalBreadcrumb.Text			= "";
				literalBreadcrumb.Text		   += "<a class=\"btn btn-default" + (bEnabled? "": " btn-active") + "\" href='" + (bEnabled? sNavigateUrl.Replace("~", ".."): "#") + "'>" + sText + "</a>";
				literalBreadcrumb.Visible		= bVisible;
				
				if(nBreadcrumbCount == 0)
					literalBreadcrumbP.Text		= literalBreadcrumbP.Text.Replace(" btn-active", "");

				nBreadcrumbCount++;
			} //end if

			panelBreadcrumbs.Visible		= true;
		}

		public void AddMessage(string sTitle, string sText, string sNavigateUrl, string sTime, string sIconClass)
		{
			Label labelMessage	= ((Label)this.FindControl("labelMessage" + labelMessagesCount.Text));
			int nWarningCount	= 0;
			int nDangerCount	= 0;

			if(labelMessage != null)
			{
				labelMessage.Text			= "";
				labelMessage.Text			+= "<div class=\"m-item\">";
				labelMessage.Text			+= "	<a href=\"" + sNavigateUrl + "\"" + (Convert.ToInt32(labelMessagesCount.Text) % 2 == 0 ? " class='toggleBgColor'":"") +">";
				labelMessage.Text			+= "		<div class=\"mi-icon " + sIconClass.Substring(sIconClass.IndexOf("text-")) + "\">";
                labelMessage.Text			+= "		<span style=\"display: inline-block; height: 100%; vertical-align: middle; font-size: 0;\"></span>";
                labelMessage.Text			+= "		<span>i</span>";
                labelMessage.Text			+= "		<span style=\"display: inline-block; height: 100%; vertical-align: middle; font-size: 0;\"></span>";
				labelMessage.Text			+= "		</div>";
				labelMessage.Text			+= "		<div class=\"mi-time\">" + sTime + "</div>";
				labelMessage.Text			+= "		<div class=\"mi-title\">" + sTitle + "</div>";
				labelMessage.Text			+= "		<div class=\"mi-text text-truncate\">" + sText + "</div>";
				labelMessage.Text			+= "	</a>";
				labelMessage.Text			+= "</div>";

				labelMessagesCount.Text	    = (Convert.ToInt32(labelMessagesCount.Text) + 1).ToString();
                labelMessagesCount2.Text    = labelMessagesCount.Text + (Convert.ToInt32(labelMessagesCount.Text) > 1 ? " Messages" : " Message");
            } //end if

            for(int i = 0; i <= 19; i++)
            {
                labelMessage = ((Label)this.FindControl("labelMessage" + i.ToString()));

                if(labelMessage.Text.IndexOf("mi-icon text-warning") >= 0)
                    nWarningCount++;
                if(labelMessage.Text.IndexOf("mi-icon text-danger") >= 0)
                    nDangerCount++;
            } //end for

            notificationLabel.Text = "";

            if (Math.Max(nDangerCount, nWarningCount) > 0) notificationLabel.Text = nDangerCount >= nWarningCount ? "label-danger" : "label-warning";
        }

		public void ClearAllMessages()
		{
			labelMessage0.Text		= "";
			labelMessage1.Text		= "";
			labelMessage2.Text		= "";
			labelMessage3.Text		= "";
			labelMessage4.Text		= "";
			labelMessage5.Text		= "";
			labelMessage6.Text		= "";
			labelMessage7.Text		= "";
			labelMessage8.Text		= "";
			labelMessage9.Text		= "";
			labelMessage10.Text		= "";

			labelMessagesCount.Text	= "0";
            labelMessagesCount2.Text= "0 Message";
        }

		public void SetActiveLeftSideNav(string sItemID)
		{
			divSiteLeftSidebar.Attributes.Add("activeID", sItemID);
		}

		public void AddLeftSideNav(string sProcessID, string sProcessName, string sElementsTop, string sLeftNavFile, string sElementsBtm, string sRecentProcesses, string sUserAccessList, string sProcessAliases, string sVariables = null)
		{
			string sLeftNavXml	= "";

			InitCurrentModuleFunctionalAreaAndUserType();

			sLeftNavXml	 += "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
			sLeftNavXml	 += "<siteMap>";
			sLeftNavXml	 += "</siteMap>";

			if(sLeftNavFile != null && sLeftNavFile != "")
			{
				StreamReader sr = new StreamReader(Server.MapPath(sLeftNavFile));

				sLeftNavXml	= sr.ReadToEnd();
				sr.Close();
			} //end if

			if(sElementsTop != null && sElementsTop != "")
			{
				string sBuffer	= sElementsTop;
				int x			= 0;

				while(sBuffer.StartsWith("{") && x < 5)
				{
					string sReplaceStr	= GetSubstring(sBuffer, 0, "{", "}");
					string sNewElements	= GetSubstring(sBuffer, 0, "{" + sReplaceStr + "}", "{/" + sReplaceStr + "}");

					sBuffer			= sBuffer.Replace("{" + sReplaceStr + "}" + sNewElements + "{/" + sReplaceStr + "}", "");
					sLeftNavXml		= sLeftNavXml.Replace(sReplaceStr, sNewElements.Replace("&", "&amp;"));

					x++;
				} //end while

				if(sLeftNavXml.IndexOf("<") >= 0)
					sLeftNavXml	= sLeftNavXml.Replace("<siteMap>", "<siteMap>" + sBuffer.Replace("&", "&amp;"));
			} //end if

			if(sElementsBtm != null && sElementsBtm != "")
				sLeftNavXml	= sLeftNavXml.Replace("</siteMap>", sElementsBtm.Replace("&", "&amp;") + "</siteMap>");
			
			if(sRecentProcesses != null && sRecentProcesses != "")
			{
				sRecentProcesses = sRecentProcesses.Replace("Section=\"\"", "Section=\"Recently Viewed Processes\"");
				sRecentProcesses = sRecentProcesses.Replace("Line=\"false\"", "Line=\"true\"");
				sLeftNavXml	= sLeftNavXml.Replace("</siteMap>", sRecentProcesses + "</siteMap>");
			} //end if

			textBoxLeftNavItemCount.Text		= DisplayLeftNav(textBoxCompanyID.Text, textBoxUserRef.Text, sProcessID, sProcessName, ref sLeftNavXml, sUserAccessList, sProcessAliases, sVariables).ToString();
			divSiteLeftSidebar.Visible			= textBoxDisableSiteNav.Text == "1" || textBoxDisableLeftNav.Text == "1" || textBoxModuleName.Text == "Undefined" || textBoxLeftNavItemCount.Text == "0"? false: true;
			textBoxProcessID.Text				= sProcessID;
			textBoxProcessName.Text				= sProcessName;
			textBoxLeftNavElementTop.Text		= sElementsTop;
			textBoxLeftNavElementBtm.Text		= sElementsBtm;
			textBoxLeftNavFile.Text				= sLeftNavFile;
			textBoxLeftNavRecentPrc.Text		= sRecentProcesses;
			textBoxLeftNavUserAccessList.Text	= sUserAccessList;
			textBoxProccessAliases.Text			= sProcessAliases;
			textBoxLeftNavVariables.Text		= sVariables;
		}

		public void DisplaySiteNav(bool bDisplay)
		{
			DisplaySiteNav(bDisplay, !bDisplay);
		}

		public void DisplaySiteNav(bool bDisplay, bool bSpace)
		{
			textBoxDisableSiteNav.Text		= bDisplay? "0": "1";
			textBoxDisableLeftNav.Text		= bDisplay? "0": "1";

			divSiteTopNav.Visible			= bDisplay;
			divSiteLeftSidebar.Visible		= bDisplay;
			panelBreadcrumbs.Visible		= bDisplay;
			panelSpaceTop.Visible			= bSpace;
			panelSpaceBtm.Visible			= bSpace;
		}

		public void DisplayLeftNav(bool bDisplay)
		{
			textBoxDisableLeftNav.Text		= bDisplay? "0": "1";
			divSiteLeftSidebar.Visible		= bDisplay;
		}

		public void FocusObjectClientID(string sFocusObjectClientID)
		{
			textBoxFocusObjClientID.Text	= sFocusObjectClientID;
		}

		public string BackUrl {
			get
			{
				return textBoxBackUrl.Text;
			}
		}
	}
}