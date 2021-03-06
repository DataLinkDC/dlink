/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */


package com.dlink.utils;

import com.dlink.assertion.Asserts;

/**
 * SqlUtil
 *
 * @author wenmo
 * @since 2021/7/14 21:57
 */
public class SqlUtil {

    private static final String SEMICOLON = ";";

    public static String[] getStatements(String sql, String sqlSeparator) {
        if (Asserts.isNullString(sql)) {
            return new String[0];
        }

        String[] splits = sql.split(sqlSeparator);
        String lastStatement = splits[splits.length - 1].trim();
        if (lastStatement.endsWith(SEMICOLON)){
            splits[splits.length - 1] = lastStatement.substring(0,lastStatement.length()-1);
        }

        return splits;
    }

    public static String removeNote(String sql) {
        if (Asserts.isNotNullString(sql)) {
            sql = sql.replaceAll("\u00A0", " ").replaceAll("--([^'\r\n]{0,}('[^'\r\n]{0,}'){0,1}[^'\r\n]{0,}){0,}", "").replaceAll("[\r\n]+", "\r\n").trim();
        }
        return sql;
    }

    public static String replaceAllParam(String sql, String name, String value) {
        return sql.replaceAll("\\$\\{" + name + "\\}", value);
    }
}
