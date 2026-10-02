plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// La versión la pone GitHub Actions a partir de la etiqueta (v1.2.3) y del número de compilación.
val appVersionName = (findProperty("versionName") as String?) ?: "0.0.0-dev"
val appVersionCode = (findProperty("versionCode") as String?)?.toIntOrNull() ?: 1
val keystorePath: String? = System.getenv("RS_KEYSTORE")

android {
    namespace = "com.gaqlh.reactorswipe"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.gaqlh.reactorswipe"
        minSdk = 29
        targetSdk = 35
        versionCode = appVersionCode
        versionName = appVersionName
    }

    signingConfigs {
        create("release") {
            if (keystorePath != null) {
                storeFile = file(keystorePath)
                storeType = "pkcs12"
                storePassword = System.getenv("RS_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("RS_KEY_ALIAS") ?: "reactorswipe"
                keyPassword = System.getenv("RS_KEYSTORE_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = if (keystorePath != null) signingConfigs.getByName("release") else signingConfigs.getByName("debug")
        }
    }

    // La interfaz es la misma de la extensión: se empaqueta tal cual dentro de la app.
    sourceSets["main"].assets.srcDirs("../../extension")

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        buildConfig = true
    }
    lint {
        checkReleaseBuilds = false
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.webkit:webkit:1.12.1")
    implementation("androidx.work:work-runtime-ktx:2.10.0")
}
