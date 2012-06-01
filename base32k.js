/*
 *  base32k.js
 *  https://github.com/simonratner/base32k
 *
 *  Javascript implementation of base32k encoding, used to efficiently pack
 *  binary data into javascript's UTF-16 strings.
 *
 *  Based on comments by Perry A. Caro <caro@adobe.com>:
 *      http://lists.xml.org/archives/xml-dev/200307/msg00505.html
 *      http://lists.xml.org/archives/xml-dev/200307/msg00507.html
 *
 *  [Original comments follow, with corrections.]
 *
 *  Because of Unicode normalization requirements, it is important to pick an
 *  alphabet of codepoints that are unaffected by normalization, composition,
 *  or decomposition, and that are legal XML of course. I used the following
 *  ranges:
 *
 *      U+3400 thru U+4DB5 for 15-bit values of 0 thru 6581
 *      U+4E00 thru U+9FA5 for 15-bit values of 6582 thru 27483
 *      U+E000 thru U+F4A3 for 15-bit values of 27484 thru 32767
 *
 *  I was a little worried about using the private use area, since there are
 *  no guarantees about how an XML processor will report them, but there is
 *  no other contiguous range of Unicode codepoints of that size that avoid
 *  normalization issues.
 *
 *  Rather than padding, it turns out to be more useful to think about which
 *  bits are significant in the very last text character of the encoded data.
 *  Unless the original data was an even multiple of 15 bits, there will be
 *  from 1 to 14 bits left to encode. These bits can easily fit into a 16-bit
 *  text character, but unless some additional information is provided, a
 *  decoder will not be able to tell how many of the bits in the final text
 *  character are significant.
 *
 *  To solve this problem, a final UTF-16 character is used. This character is
 *  outside of the ranges listed above, so as not to be confused with data, and
 *  is used as a clear termination for the encoded data. It is selected from a
 *  contiguous range of 15 characters that have no normalization issues. I
 *  chose the following range, but there are several possible alternatives:
 *
 *      U+2401 thru U+240F
 *
 *  When this character is encountered, it signals the end of the encoding, and
 *  specifies the number of significant bits in the previous text character.
 *  U+2401 specifies 1 bit is significant, U+2402 specifies 2 bits, etc., thru
 *  U+240F for all 15 bits significant. This means that every encoded sequence
 *  is terminated by one of these characters, regardless of how many bits were
 *  in the original data.
 *
 *  As for all of the text characters, the data bits are read from most
 *  significant (0x4000) to least significant (0x0001).
 */

!function(context){

// Work around javascript's argument limit.
// See: http://webreflection.blogspot.com/2011/07/about-javascript-apply-arguments-limit.html
var fromCharCodes = (function(fromCharCode, maxargs) {
  return function(code) {
    typeof code == "number" && (code = [code]);
    var parts = [];
    for (var i = 0, len = code.length; i < len; i += maxargs) {
      parts.push(fromCharCode.apply(null, code.slice(i, i + maxargs)));
    }
    return parts.join("");
  };
}(String.fromCharCode, 2048));

context.base32k = {
  encode: function(a) {
    var bits = a.length * 32;
    var out = [];
    for (var p, q, r, i = 0; i < bits; i += 15) {
      q = (i / 32) | 0;  // force to int; Math.floor also works
      r = (i % 32);
      if (r <= 17) {
        p = (0x7FFF & (a[q] >>> (17 - r)));
      } else {
        p = (0x7FFF & (a[q] << (r - 17))) + (0x7FFF & (a[q + 1] >>> (49 - r)));
      }
      if (p < 6582) {
        out.push(0x3400 + p);
      } else if (p < 27484) {
        out.push(0x4E00 + p - 6582);
      } else {
        out.push(0xE000 + p - 27484);
      }
    }
    out.push(0x240F - (i - bits));  // terminator
    return fromCharCodes(out);
  }
  ,
  decode: function(s) {
    var tailbits = s.charCodeAt(s.length - 1) - 0x2400;
    var out = [];
    for (var p, q, r, i = 0, len = s.length - 1; i < len; i++) {
      p = s.charCodeAt(i);
      q = ((i * 15) / 32) | 0;  // force to int; Math.floor also works
      r = ((i * 15) % 32);
      if (p >= 0x3400 && p <= 0x4DB5) {
        p -= 0x3400;
      } else if (p >= 0x4E00 && p <= 0x9FA5) {
        p -= 0x4E00 - 6582;
      } else if (p >= 0xE000 && p <= 0xF4A3) {
        p -= 0xE000 - 27484;
      } else {
        throw "Invalid encoding U+" + p;
      }
      if (r <= 17) {
        out[q] |= p << (17 - r);
      } else {
        out[q] |= p >>> (r - 17);
        out[q + 1] |= p << (49 - r);
      }
    }
    if (tailbits < 15) {
      out.length--;
    }
    return out;
  }
}

}(this);
