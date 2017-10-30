/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.ballerinalang.config.utils.parser;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The base class for Ballerina configuration parsing. This class contains the common constants and methods required for
 * parsing Ballerina configurations.
 *
 * @since 0.95
 */
public abstract class AbstractConfigParser {

    protected static final String instanceIdFormat = "\\[[a-zA-Z0-9]+\\]";
    protected static final String commentOrWSFormat = "[\\s]*#[\\ -~]*|[\\s]*"; // to skip comments or whitespace
    protected static final String variableFormat = "\\$(env|sys)\\{([a-zA-Z_]+[a-zA-Z0-9_\\.]*)\\}";
    protected static final Pattern variablePattern = Pattern.compile(variableFormat);

    private static final String ENVIRONMENT_VARIABLE = "env";
    private static final String SYSTEM_PROPERTY = "sys";

    protected Map<String, String> globalConfigs = new HashMap<>();
    protected Map<String, Map<String, String>> instanceConfigs = new HashMap<>();

    /**
     * Returns the parsed global configurations as a map.
     *
     * @return Global configurations map
     */
    public Map<String, String> getGlobalConfigs() {
        return globalConfigs;
    }

    /**
     * Returns the parsed instance level configurations as a map.
     *
     * @return Instance configurations map
     */
    public Map<String, Map<String, String>> getInstanceConfigs() {
        return instanceConfigs;
    }

    /**
     * This method takes the value of a Ballerina configuration key/value pair and processes it to replace any system or
     * environment variables present.
     *
     * @param value
     * @return
     */
    protected String parseConfigValue(String value) {
        Matcher matcher = variablePattern.matcher(value);

        if (!matcher.find()) {
            return value;
        }

        StringBuilder varReplacedValue = new StringBuilder();
        int i = 0;
        do {
            if (matcher.start() != i) {
                varReplacedValue.append(value.substring(i, matcher.start()));
            }

            String varType = matcher.group(1);
            String key = matcher.group(2);
            switch (varType) {
                case ENVIRONMENT_VARIABLE:
                    varReplacedValue.append(System.getenv(key));
                    break;
                case SYSTEM_PROPERTY:
                    varReplacedValue.append(System.getProperty(key));
                    break;
            }
        } while (matcher.find());

        return varReplacedValue.toString();
    }

    protected String extractInstanceId(String id) {
        return id.substring(1, id.length() - 1);
    }
}
