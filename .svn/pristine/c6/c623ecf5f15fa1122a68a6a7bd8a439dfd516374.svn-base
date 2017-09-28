#!/usr/bin/env bash

runNoStdout() {
    "$@" || exit 1
}

run() {
    echo "[HOOK] Running $@"
    runNoStdout "$@"
}

## All project related setup, seds, greps, and awks.
PROJECT_ROOT="${1}"
platform="${CORDOVA_PLATFORMS}"
workdir="${PROJECT_ROOT}"

echo "[HOOK] ${0} ${*}"

main() {
    echo "[HOOK] PROJECT_ROOT=[${PROJECT_ROOT}]"
    echo "[HOOK] platform=[${platform}]"
    echo "[HOOK] workdir=[${workdir}]"
    run sed -i'' -e "s|\(storeFile=\s*\).*$|\1"${workdir}"/simulations.keystore|g" ${workdir}/platform_defaults/${platform}/release-signing.properties
    run cp -vf ${workdir}/platform_defaults/${platform}/release-signing.properties ${workdir}/platforms/android/
    run cp -vf ${workdir}/platform_defaults/${platform}/release-signing.properties ${workdir}/platforms/android/debug-signing.properties
}

main

