require 'rake'
require 'albacore'
require 'json'

$projectSolution = 'DotNetExtensions.sln'
$artifactsPath = "build"
$nugetFeedPath = ENV["NuGetDevFeed"]
$closure = ENV["Closure"]
$srcFolder = File.expand_path('src')

task :clean do
    puts "Cleaning"
    FileUtils.rm_rf $artifactsPath
end

task :nuget => [:build] do
	sh "nuget pack src\\BclExtensionMethods\\BclExtensionMethods.csproj /OutputDirectory " + $nugetFeedPath + 
		" /Exclude \"*Dynamic Expressions.html\""
end

task :compile do
	# requires json gem (also needs dev kit http://rubyinstaller.org/downloads)
	# requires closure installed and ENV['CLOSURE'] points to compiler.jar
	sources = nil
	source_list_file = File.join($srcFolder, "SourcesList.json")
	open(source_list_file){ |file|	
		sources = JSON.parse(file.read)
			.map{|f| %Q{--js "#{File.join($srcFolder, f)}" }}
	}
	
	# compile javascript with closure
	output = File.join($artifactsPath, 'financial-min.js')
	ensureArtifactsExists()
	sh %Q{java -jar #{$closure} #{sources.join(' ')} --js_output_file #{output}}
end

def ensureArtifactsExists
	FileUtils.mkdir($artifactsPath) unless File.directory?($artifactsPath)
end

desc "Setup dependencies for nuget packages"
task :dep do
	package_folder = File.expand_path('Packages')
    packages = FileList["**/packages.config"].map{|f| File.expand_path(f)}
	packages.each do |file|
		sh %Q{nuget install #{file} /OutputDirectory #{package_folder}}
    end
end