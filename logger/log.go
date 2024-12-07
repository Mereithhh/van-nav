package logger

import (
	"fmt"
	"os"
	"time"
)

var Logger *MyLogger

func init() {
	Logger = NewLogger()
}

// 定义日志级别
type Level int

const (
	InfoLevel  Level = iota // 0
	ErrorLevel              // 1
)

// Logger 结构体
type MyLogger struct {
	level Level
}

// 创建新的 logger 实例
func NewLogger() *MyLogger {
	return &MyLogger{
		level: InfoLevel,
	}
}

// Info 记录信息级别的日志
func (l *MyLogger) Info(format string, args ...interface{}) {
	if l.level <= InfoLevel {
		l.log("INFO", format, args...)
	}
}

// Error 记录错误级别的日志
func (l *MyLogger) Error(format string, args ...interface{}) {
	if l.level <= ErrorLevel {
		l.log("ERROR", format, args...)
	}
}

// 内部日志记录方法
func (l *MyLogger) log(level string, format string, args ...interface{}) {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	message := fmt.Sprintf(format, args...)
	logEntry := fmt.Sprintf("[%s] [%s] %s\n", timestamp, level, message)

	// 信息级别输出到标准输出
	if level == "INFO" {
		fmt.Fprint(os.Stdout, logEntry)
	} else {
		// 错误级别输出到标准错误
		fmt.Fprint(os.Stderr, logEntry)
	}
}

func LogInfo(format string, args ...interface{}) {
	Logger.Info(format, args...)
}

func LogError(format string, args ...interface{}) {
	Logger.Error(format, args...)
}
