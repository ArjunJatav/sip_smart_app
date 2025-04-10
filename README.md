# Wine APP


#################### THIS CODE FOR Time.h FILE  START ##########################
 
 File Location  :- wine-app/ios/Pods/RCT-Folly/folly/portability/Time.h

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#pragma once

#include <stdint.h>
#include <time.h>

#include <folly/portability/Config.h>

// OSX is a pain. The XCode 8 SDK always declares clock_gettime
// even if the target OS version doesn't support it, so you get
// an error at runtime because it can't resolve the symbol. We
// solve that by pretending we have it here in the header and
// then enable our implementation on the source side so that
// gets linked in instead.
#if __MACH__ &&                                                       \
        ((!defined(TARGET_OS_OSX) || TARGET_OS_OSX) &&                \
         (MAC_OS_X_VERSION_MIN_REQUIRED < MAC_OS_X_VERSION_10_12)) || \
    (TARGET_OS_IPHONE && (__IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_10_0))

#ifdef FOLLY_HAVE_CLOCK_GETTIME
#undef FOLLY_HAVE_CLOCK_GETTIME
#endif

#define FOLLY_HAVE_CLOCK_GETTIME 1
#define FOLLY_FORCE_CLOCK_GETTIME_DEFINITION 1

#endif

// These aren't generic implementations, so we can only declare them on
// platforms we support.
#if !FOLLY_HAVE_CLOCK_GETTIME && (defined(__MACH__) || defined(_WIN32))
#define CLOCK_REALTIME 0
#define CLOCK_MONOTONIC 1
#define CLOCK_PROCESS_CPUTIME_ID 2
#define CLOCK_THREAD_CPUTIME_ID 3

#define uint8_t unsigned char  // Re-define uint8_t if needed before the conflicting header.
extern "C" int clock_gettime(clockid_t clk_id, struct timespec* ts);
extern "C" int clock_getres(clockid_t clk_id, struct timespec* ts);
#endif

#ifdef _WIN32
#define TM_YEAR_BASE (1900)

extern "C" {
char* asctime_r(const tm* tm, char* buf);
char* ctime_r(const time_t* t, char* buf);
tm* gmtime_r(const time_t* t, tm* res);
tm* localtime_r(const time_t* t, tm* o);
int nanosleep(const struct timespec* request, struct timespec* remain);
char* strptime(
    const char* __restrict buf,
    const char* __restrict fmt,
    struct tm* __restrict tm);
time_t timelocal(tm* tm);
time_t timegm(tm* tm);
}
#endif
#################### THIS CODE FOR Time.h FILE  END ##########################



#################### THIS CODE FOR boost.podspec FILE START ##########################
File Location  :- wine-app/node_modules/react-native/third-party-podspecs/boost.podspec

# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

Pod::Spec.new do |spec|
  spec.name = 'boost'
  spec.version = '1.76.0'
  spec.license = { :type => 'Boost Software License', :file => "LICENSE_1_0.txt" }
  spec.homepage = 'http://www.boost.org'
  spec.summary = 'Boost provides free peer-reviewed portable C++ source libraries.'
  spec.authors = 'Rene Rivera'
  spec.source = { :http => 'https://archives.boost.io/release/1.76.0/source/boost_1_76_0.tar.bz2',
                  :sha256 => 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41' }

  # Pinning to the same version as React.podspec.
  spec.platforms = { :ios => '11.0' }
  spec.requires_arc = false

  spec.module_name = 'boost'
  spec.header_dir = 'boost'
  spec.preserve_path = 'boost'
end

#################### THIS CODE FOR boost.podspec FILE END ##########################