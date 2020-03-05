#!/usr/bin/env groovy
pipeline {
    agent any
    //parameters {
    //    string(name: 'BranchPath', defaultValue: 'master', description: '')
    //    choice(name: 'BuildType', choices: 'test\nrelease', description: 'test=build and run tests, release=build and create installer')
    //    string(name: 'OverrideVersion', defaultValue: '', description: '')
    //}
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
                   url: 'http://videvsql001/GitMoved/viDesktopDev.git',
                   credentialsId: 'a32b6345-33c8-46df-bfde-7af65312bf8a',
                   branch: "v2032"
                )
	            
	        }
	    }

		stage('Build') {
			steps {
				echo "Building entire solution for testing"
			    // echo env.msbuild
				// bat "\"${env.msbuild}\" \"${WORKSPACE}\\viDesktop.sln\" /t:Build;ResolveReferences /p:Configuration=Release"   /p:DeployOnBuild=true,PublishProfile=\"${WORKSPACE}\\publish.pubxml\"
				bat "\"${env.msbuild}\" \"${WORKSPACE}\\viDesktop.sln\" /t:Clean;Build;ResolveReferences /p:Configuration=Release "
				
				echo "copy license files"
				bat "xcopy \"${WORKSPACE}\\lib\\*.lic\" \"${WORKSPACE}\\bin\" /Y"
				//bat "xcopy \"${WORKSPACE}\\lib\\*.lic\" \"${WORKSPACE}\\viDesktopService.Test\\bin\\Release\" /Y"
				
				echo "remove stuff that should not be published"
				bat "if exist \"${WORKSPACE}\\FederationMetadata\" rmdir \"${WORKSPACE}\\FederationMetadata\" /s /q"
			}
		}
 		stage('Run unit tests') {
 			environment { 
 				nunit = "C:\\Program Files (x86)\\NUnit.org\\nunit-console\\nunit3-console.exe" 
 			}
 			steps {
 				echo "running tests"
 				//format as nunit2 so xUnit plugin can display results
 				bat "xcopy \"${WORKSPACE}\\lib\\*.lic\" \"${WORKSPACE}\\viDesktopService.Test\\bin\\Release\" /Y"
 				bat "\"${env.nunit}\" \"${WORKSPACE}\\viDesktopService.Test\\bin\\Release\\viDesktopService.Test.dll\"  -result:TestResult.xml;format=nunit2"
             }
 		}
	}
}