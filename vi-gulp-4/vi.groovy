// https://blog.dangl.me/archive/configure-git-hooks-on-bonobo-git-server-in-windows/
#!/usr/bin/env groovy
pipeline {
    agent any
    parameters {
        string(name: 'BranchPath', defaultValue: 'master', description: '')
        choice(name: 'BuildType', choices: 'test\nrelease', description: 'test=build and run tests, release=build and create package.zip')
        //    string(name: 'OverrideVersion', defaultValue: '', description: '')
    }
	environment { 
		//scriptDir = "${WORKSPACE}\\_jenkins"
        //msbuild0 = "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\MSBuild\\Current\\Bin\\msbuild.exe"
		//defaultVersion = "2020.1.1.0"
		gulpDir = "D:\\gulpBuild" 
    }
	stages {
	    stage ("Checkout"){
	        steps {
                echo ("Checking out source code")
                //checkout([$class: 'TeamFoundationServerScm', credentialsConfigurer: [$class: 'AutomaticCredentialsConfigurer'], projectPath: '$/SassConverter', serverUrl: 'http://videvsql001:8080/tfs/viDesktop/', useOverwrite: true, useUpdate: true, workspaceName: 'Hudson-${JOB_NAME}'])
	            git(
                   url: 'http://videvc001/Git/viDesktopDev.git',
                   credentialsId: 'a32b6345-33c8-46df-bfde-7af65312bf8a',
                   branch: "dev01"
                )
	            
	        }
	    }
// 		stage('Build All') {
// 			when {
// 				expression {params.BuildType == 'test'}
// 			}
// 			steps {			
// 		        echo "Building entire solution for testing"
// 				bat "\"${env.msbuild}\" ${WORKSPACE}\\Xcelerate.sln /t:Clean;Build;ResolveReferences /p:Configuration=Debug"
//             }
// 		}
		
		stage('Build Debug') {
			when {
				expression {params.BuildType == 'test'}
			}
			steps {
				echo "Building entire solution in Debug Mode for testing"
				bat "\"${env.msbuild}\" \"${WORKSPACE}\\viDesktop.sln\" /t:Clean;Build;ResolveReferences /p:Configuration=Debug "
				
				echo "copy license files"
				bat "xcopy \"${WORKSPACE}\\lib\\*.lic\" \"${WORKSPACE}\\bin\" /Y"
				
				echo "remove stuff that should not be published"
				bat "if exist \"${WORKSPACE}\\FederationMetadata\" rmdir \"${WORKSPACE}\\FederationMetadata\" /s /q"
			}
		}
 		stage('Run Unit Tests') {
 			environment { 
 				nunit = "C:\\Program Files (x86)\\NUnit.org\\nunit-console\\nunit3-console.exe" 
 			}
			when {
				expression {params.BuildType == 'test'}
			}
			steps {
			    parallel nunit: {
     				echo "running tests"
     				//format as nunit2 so xUnit plugin can display results
     				bat "xcopy \"${WORKSPACE}\\lib\\*.lic\" \"${WORKSPACE}\\viDesktopService.Test\\bin\\Debug\" /Y"
     				bat "\"${env.nunit}\" \"${WORKSPACE}\\viDesktopService.Test\\bin\\Debug\\viDesktopService.Test.dll\"  -result:TestResult.xml;format=nunit2"
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
				echo "Building entire solution in Release Mode for publish"
				bat "\"${env.msbuild}\" \"${WORKSPACE}\\viDesktop.sln\" /t:Build;ResolveReferences /p:Configuration=Release /p:DeployOnBuild=true,PublishProfile=\"${WORKSPACE}\\publish.pubxml\""
				
				echo "copy license files"
				bat "xcopy \"${WORKSPACE}\\lib\\*.lic\" \"${WORKSPACE}\\bin\" /Y"
				
				echo "remove stuff that should not be published"
				bat "if exist \"${WORKSPACE}\\FederationMetadata\" rmdir \"${WORKSPACE}\\FederationMetadata\" /s /q"
			}
		}
	}
}