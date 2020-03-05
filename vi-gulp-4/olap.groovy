//  https://cheatsheet.dennyzhang.com/cheatsheet-jenkins-groovy-a4
pipeline {
    agent any
    parameters {
        string(name: 'BranchPath', defaultValue: 'master', description: '')
        choice(name: 'BuildType', choices: 'test\nrelease', description: 'test=build and run tests, release=build and create installer')
        string(name: 'Version', defaultValue: '2019.3.3.0', description: '')
    }
	environment { 
		scriptDir = "${WORKSPACE}\\_jenkins"
        msbuild = "C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin\\msbuild.exe" 
		packageName = getPackageName("${params.Version}", "${currentBuild.number}", "${params.BranchPath}")
		gulpDir = "D:\\gulpBuild" 
    }
    stages {
        stage('Init') {
            steps {
				wrap([$class: 'BuildUser']) {
					script {
						try {
							notifySlackStarted("${BUILD_USER}") //not exist if use remote token
						}
						catch (e) {
							notifySlackStarted("remote user")
						}
					}
				}
                
				
				dir ("${WORKSPACE}\\.nuget") { 
					bat ".\\NuGet.exe update -self"
					bat ".\\NuGet.exe restore ${WORKSPACE}\\Xcelerate.sln"
				}
				
				dir ("${WORKSPACE}\\_jenkins") {
					bat "call updateVersionInfo.bat ${params.Version} ${currentBuild.number}"
				}
				
				echo "Gulp setup"
				
				dir ("${WORKSPACE}\\XcelerateAdminPortal") {
					bat "xcopy \"${env.gulpDir}\\bower_components\" \"bower_components\\\" /e /y /q"
					bat "npm install"
				}
            }
        }
		stage('Build All') {
			when {
				expression {params.BuildType == 'test'}
			}
			steps {			
		        echo "Building entire solution for testing"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\Xcelerate.sln /t:Clean;Build;ResolveReferences /p:Configuration=Debug"
            }
		}
		stage('Run unit tests') {
			environment { 
				nunit = "D:\\PublishingTools\\NUnit-3.2.1\\bin\\nunit3-console.exe" 
			}
			when {
				expression {params.BuildType == 'test'}
			}
			steps {
			
              //run in parallel so that failure of one does not stop other
			    parallel nunit: {
					echo "running tests"
                    //format as nunit2 so xUnit plugin can display results
					bat "\"${env.nunit}\" ${WORKSPACE}\\Xcelerate.sln --where \"cat != Integration\" -result:TestResult.xml;format=nunit2"
					
				}, karma: {
					dir("${WORKSPACE}\\XcelerateAdminPortal") {
						bat "npm run test"
					}
				} 
            }
		}
		stage('Build Release') {
			environment { 
				publishDir = "D:\\PublishBuilds\\${params.Version}" 
			}
			when {
				expression {params.BuildType == 'release'}
			}
			steps {
				echo "gulp release"
				dir ("${WORKSPACE}\\XcelerateAdminPortal") { 
					bat "call gulp release"
				}
				
				echo "running release build"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\XcelerateAddIn\\XcelerateAddIn.csproj /t:Clean;Build;ResolveReferences /p:Configuration=Release;OutDir=${env.publishDir}\\Addin\\"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\XcelerateAdminPortal\\XcelerateAdminPortal.csproj /t:Clean;Build;ResolveReferences;_CopyWebApplication /p:Configuration=Release;OutDir=${env.publishDir}\\Adminportal\\bin;WebProjectOutputDir=${env.publishDir}\\Adminportal\\"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\XcelerateWcfServiceHost\\XcelerateWcfServiceHost.csproj /t:Clean;Build;ResolveReferences;_CopyWebApplication /p:Configuration=Release;OutDir=${env.publishDir}\\service\\bin;WebProjectOutputDir=${env.publishDir}\\service\\"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\Xcelerate.Builder.AddIn\\Xcelerate.Builder.AddIn.csproj /t:Clean;Build;ResolveReferences /p:Configuration=Release;OutDir=${env.publishDir}\\builder\\"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\ServerWebAPI\\ServerWebAPI.csproj /t:Clean;Build;ResolveReferences;_CopyWebApplication /p:Configuration=Release;OutDir=${env.publishDir}\\webapi\\bin;WebProjectOutputDir=${env.publishDir}\\webapi\\"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\UpgradeXml\\UpgradeXml.csproj /t:Clean;Build /p:Configuration=Release;OutDir=${env.publishDir}\\webapi\\bin"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\FileSynchonizer\\FileSynchronizer.csproj /t:Clean;Build /p:Configuration=Release;OutDir=${env.publishDir}\\filesync\\;PreBuildEvent=\"\";PostBuildEvent=\"\""
				bat "\"${env.msbuild}\" ${WORKSPACE}\\XcelerateSqlClr.sln /t:Clean;Build /p:Configuration=Release;OutDir=${env.publishDir}\\sqlclr\\"
				bat "\"${env.msbuild}\" ${WORKSPACE}\\XcelerateInstaller\\XcelerateInstaller.csproj /t:Clean;Build;ResolveReferences /p:Configuration=Release;OutDir=${env.publishDir}\\installer\\"

				echo "generating license file"
				bat "powershell.exe -command \"${WORKSPACE}\\Scripts\\generate_thirdparty_licenses.ps1 -destinationPath D:\\xcelerate\\ThirdPartyLicenses.txt\" "
				
				echo "Copy ClientInstallerTools:"
				bat "xcopy \"${WORKSPACE}\\ClientInstallerTools\\*.*\" \"D:\\PublishingTools\\XcelerateInstaller\\XcelerateInstaller\\XcelerateMachineInstaller64Bit\" /Y"

				echo "create msi files"
				dir ("${WORKSPACE}\\_jenkins") {
					bat "call createMsiFiles.bat ${params.Version} ${currentBuild.number}"
				}
				
				echo "remove stuff that should not be published"
				bat "if exist \"${env.publishDir}\\Adminportal\\.eslintrc\" del \"${env.publishDir}\\Adminportal\\.eslintrc\" /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\.tfignore\" del \"${env.publishDir}\\Adminportal\\.tfignore\" /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\*.json\" del \"${env.publishDir}\\Adminportal\\*.json\" /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\readme.md\" del \"${env.publishDir}\\Adminportal\\readme.md\" /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\gulpfile.js\" del \"${env.publishDir}\\Adminportal\\gulpfile.js\" /q"

				bat "if exist \"${env.publishDir}\\Adminportal\\gulp\\\" rmdir \"${env.publishDir}\\Adminportal\\gulp\" /s /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\src\\\" rmdir \"${env.publishDir}\\Adminportal\\src\" /s /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\test\\\" rmdir \"${env.publishDir}\\Adminportal\\test\" /s /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\bower_components\\\" rmdir \"${env.publishDir}\\Adminportal\\bower_components\" /s /q"
				bat "if exist \"${env.publishDir}\\Adminportal\\node_modules\\\" rmdir \"${env.publishDir}\\Adminportal\\node_modules\" /s /q"

			}
		}
		stage('Package and deploy') {
			environment { 
				publishDir = "D:\\PublishBuilds\\${params.Version}" 
				packageDir = "D:\\Ready Build Packages\\${params.Version}-Build" 
				versionLabel = getVersionLabel("${params.Version}", "${currentBuild.number}")
			}
			when {
				expression {params.BuildType == 'release'}
			}
			steps {
				
				echo "Clean up build folder, delete previous build:"
				bat "if exist \"${env.packageDir}\\\" rmdir \"${env.packageDir}\" /s /q"
				bat "mkdir \"${env.packageDir}\""

				echo "Copy built files, remove un-needed files:"
				bat "xcopy \"${env.publishDir}\" \"${env.packageDir}\" /e"
				bat "if exist \"${env.packageDir}\\sqlclr\\*.dacpac\" del \"${env.packageDir}\\sqlclr\\*.dacpac\""
				bat "if exist \"${env.packageDir}\\sqlclr\\*.sql\" del \"${env.packageDir}\\sqlclr\\*.sql\""
				bat "if exist \"${env.packageDir}\\service\\XcelerateUploadDir\\\" rmdir \"${env.packageDir}\\service\\XcelerateUploadDir\" /s /q"

				echo "Copy xcelerate add-in MSI, builder MSI, and How-to documents:"
				bat "if exist \"${env.packageDir}\\Addin\\\" rmdir \"${env.packageDir}\\Addin\" /s /q"
				bat "if exist \"${env.packageDir}\\Builder\\\" rmdir \"${env.packageDir}\\Builder\" /s /q"
				bat "mkdir \"${env.packageDir}\\Addins\""
				bat "xcopy \"D:\\PublishingTools\\XcelerateInstaller\\XcelerateInstaller\\XcelerateMachineInstaller64Bit\\bin\\Release\\*Addin*${env.versionLabel}*msi\" \"${env.packageDir}\\Addins\""
				bat "xcopy \"D:\\PublishingTools\\XcelerateInstaller\\XcelerateInstaller\\XcelerateMachineInstaller64Bit\\bin\\Release\\*Builder*${env.versionLabel}*msi\" \"${env.packageDir}\\Addins\""
				bat "xcopy \"D:\\xcelerate\\How to Install Add-ins Silently.txt\" \"${env.packageDir}\\Addins\""
				bat "xcopy \"D:\\xcelerate\\How to Install Add-ins.pdf\" \"${env.packageDir}\\Addins\""
				bat "if exist \"${env.packageDir}\\Addins\\*.wixpdb\" del \"${env.packageDir}\\Addins\\*.wixpdb\""

				echo "Copy Tools - ADExplorer, URL Rewrite MSI, xcelerate Encryption Tool:"
				bat "if exist \"${env.packageDir}\\Tools\\\" rmdir \"${env.packageDir}\\Tools\" /s /q"
				bat "mkdir \"${env.packageDir}\\Tools\""
				bat "xcopy \"D:\\xcelerate\\tools\\*\" \"${env.packageDir}\\Tools\""

				echo "Remove all web.config files:"
				bat "if exist \"${env.packageDir}\\Adminportal\\Web*config\" del \"${env.packageDir}\\Adminportal\\Web*config\""
				bat "if exist \"${env.packageDir}\\service\\Web*config\" del \"${env.packageDir}\\service\\Web*config\""
				bat "if exist \"${env.packageDir}\\webapi\\Web*config\" del \"${env.packageDir}\\webapi\\Web*config\""
				bat "if exist \"${env.packageDir}\\filesync\\FileSynchronizer.exe.config\" del \"${env.packageDir}\\filesync\\FileSynchronizer.exe.config\""

				echo "Copy ConfigTemplates, WorksheetsReports, and Packages:"
				bat "xcopy \"%WORKSPACE%\\XcelerateInstaller\\ConfigTemplates\" \"${env.packageDir}\\ConfigTemplates\\*\" /s"
				bat "xcopy \"%WORKSPACE%\\XcelerateInstaller\\WorksheetsReports\" \"${env.packageDir}\\WorksheetsReports\\*\" /s"
				bat "xcopy \"%WORKSPACE%\\XcelerateInstaller\\Scripts\\Processes\\Packages\\*.zip\" \"${env.packageDir}\\Processes\\Packages\\*\" /s"

				echo "copy licence text file"
				bat "copy \"D:\\xcelerate\\ThirdPartyLicenses.txt\" \"${env.packageDir}\\Adminportal\\ThirdPartyLicenses.txt\" "
				bat "copy \"D:\\xcelerate\\ThirdPartyLicenses.txt\" \"${env.packageDir}\\webapi\\ThirdPartyLicenses.txt\" "
				bat "copy \"D:\\xcelerate\\ThirdPartyLicenses.txt\" \"${env.packageDir}\\service\\ThirdPartyLicenses.txt\" "

				echo "Copy missing DLLs:"
				bat "copy \"D:\\PublishingTools\\MakeAutomatedPackage_files\\dsofile.dll\" \"${env.packageDir}\\filesync\\dsofile.dll\" "
				bat "xcopy \"D:\\PublishingTools\\MakeAutomatedPackage_files\\network_dll\" \"${env.packageDir}\\Adminportal\\bin\" /s /y"
				bat "xcopy \"D:\\PublishingTools\\MakeAutomatedPackage_files\\network_dll\" \"${env.packageDir}\\service\\bin\" /s /y"
				bat "xcopy \"D:\\PublishingTools\\MakeAutomatedPackage_files\\network_dll\" \"${env.packageDir}\\webapi\\bin\" /s /y"
				
				echo "Digital Sign the installer:"
				bat "\"C:\\Program Files (x86)\\Windows Kits\\8.0\\bin\\x86\\signtool.exe\" sign /f \"D:\\code signing\\sign_SHA1.pfx\" /p x!r8PWD /tr http://tsa.starfieldtech.com /td SHA256 /d \"xcelerate Installer\" \"${env.packageDir}\\installer\\Xcelerate.Installer.exe\""

				echo "Create Shortcut to the installer:"
				dir ("${WORKSPACE}\\_jenkins") {
					bat "cscript.exe /nologo createShortcut.vbs \"${env.packageDir}\" \"D:\\Ready Build Packages\\Setup-${env.packageName}\" "
				}
				echo "Zip:"
				bat "powershell.exe -nologo -noprofile -command \"& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::CreateFromDirectory('${env.packageDir}', 'D:\\Ready Build Packages\\Setup-${env.PackageName}.zip') }\""

				echo "Copy to Network Share:"
				bat "REM copy \"D:\\Ready Build Packages\\Setup-${env.PackageName}.zip\" \"\\\\192.168.2.222\\d\$\\Setup-${env.PackageName}.zip\""
				bat "copy \"D:\\Ready Build Packages\\Setup-${env.PackageName}.zip\" \"\\\\fs01\\shares\\departments\\development\\builds\\Setup-${env.PackageName}.zip\""
				bat "REM copy \"D:\\Ready Build Packages\\Setup-${env.PackageName}.zip\" \"\\\\QA-01\\xcelerate_WIP\\Setup-${env.PackageName}.zip\""
			}
		}
    }
    post { 
        always { 
			script {
                if( params.BuildType == 'test' ) {

                    step([$class: 'XUnitPublisher',
                        thresholds: [[$class: 'FailedThreshold', unstableThreshold: '1']],
                        tools: [
                          [$class: 'NUnitJunitHudsonTestType', pattern: 'TestResult.xml'],
                          [$class: 'JUnitType', pattern: 'jsTestResults.xml']
                       ]
                    ])
                }
            }

			notifySlackFinished(currentBuild.currentResult, env.packageName)
        }
    }
}

String getVersionLabel(version, buildNumber) {
	label = ''
    for (int i = 2; i < 9; i++) {
      label += version[i]
    }
    return label + leftPad(buildNumber, 3)
}

String getPackageName(version, buildNumber, branch) {
    name = getVersionLabel(version, buildNumber)
	//if (branch != "master") {
	//	name += "_" + branch.replaceAll("/", "_")
	//}
	return name
}

String leftPad(String num, int desiredLength) {
  	int padChars = desiredLength - num.length()
  	formattedNumber = ''
    for (int i = 0; i < padChars; i++) {
      formattedNumber += '0'
    }
  	formattedNumber += num
    return formattedNumber
}

void notifySlackStarted(String user) {
	def color = '#D4DADF'	
	notifySlack(wrapMessage('Started by ' + user), color)
	
	def changes = getChangeString()
    if (changeString) {
		notifySlack("Changes:\n" + changeString, color)
    } else {
		notifySlack("No changes." + changeString, color)
	}
}

void notifySlackFinished(String result, String packageName) {
	def green = '#2EB886'
	def red = '#A30200'
	
	def color = (result == 'SUCCESS') ? green : red;	
	def msg = "Done"	
	
	if (params.BuildType == 'test') {
		msg = "${params.BranchPath} - ${currentBuild.displayName}: " + result + " <${BUILD_URL}/testReport|(View test results)>"
	}
	else if (params.BuildType == 'release') {
		msg = wrapMessage(result)
		if (result == 'SUCCESS')
			msg += "\nYou can find the installer at S:\\Departments\\Development\\Builds\\Setup-${packageName}.zip"	
	}
	notifySlack(msg, color)
}

String wrapMessage(String msg) {
    return "${params.BranchPath} - ${currentBuild.displayName}: " + msg + " <${BUILD_URL}|(Open)>"
}

void notifySlackWrap(String msg, String color) {
    notifySlack(wrapMessage(msg), color)
}

void notifySlack(String msg, String color = '#D4DADF') {
    def sendTo = 'builds'
	def domain = 'xcelerate'
    def token = 'K2OYKrKs342ZpeidvYm3GqVF'
	
	if (params.BuildType == 'test') sendTo = 'unittests'

	slackSend(channel: sendTo, color: color, message: msg, teamDomain: domain, token: token)
}

String getChangeString() {
    MAX_MSG_LEN = 100
    def changeString = ""

    echo "Gathering SCM changes"
    def changeLogSets = currentBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            truncated_msg = entry.msg.take(MAX_MSG_LEN)
            changeString += " - ${truncated_msg} [${entry.author}]\n"
        }
    }
    return changeString
}